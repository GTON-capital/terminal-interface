import {
    textLine,
    textWord,
} from 'crt-terminal';
import messages from '../../Messages/Messages';
import { getOpenKey, signData, decryptMessage } from "../WEB3/chat/metamaskAPI"
import { makeRequest, getWhitelist, encryptMessage } from "./utils"
import commonOperators, { parser, createWorker, timeConverter } from '../common';
// Func Router 

enum Routes {
    Login = "register",
    Send = "send",
    Get = "get",
    List = "whitelist"
}

const helpWorker = ({ print }) => {
    print([textLine({ words: [textWord({ characters: messages.chatHelpText })] })]);
}

const sendWorker = createWorker(async ({ print }, msg, [userAddress]) => {
    const list = await getWhitelist();
    const message = msg.trim();
    const payload = list.map(e => {
        const sign = encryptMessage(message, e.open_key);
        return {
            payload: sign.substring(2),
            to_address: e.address
        }
    })
    let signPayload = ""
    payload.forEach(e => {
        signPayload += e.to_address + e.payload
    })
    const convertedMsg = `0x${Buffer.from(signPayload, 'utf8').toString('hex')}`;

    const sign = await signData(convertedMsg, userAddress)
    await makeRequest(Routes.Send, { downgrade: [], sign: sign.substring(2), payload })
    print([textLine({ words: [textWord({ characters: "Succesfully sent message" })] })]);
})

const loginWorker = createWorker(async ({ print }, args, [userAddress]) => {
    const name = (args.split(" ")[0]).trim();
    const openKey = await getOpenKey(userAddress)
    const sign = await signData(openKey, userAddress)
    await makeRequest(Routes.Login, { open_key: openKey, sign: sign.substring(2), name })
    print([textLine({ words: [textWord({ characters: "Succesfully logged in" })] })]);
}, "Something went wrong while registering")

const loadWorker = createWorker(async ({ print }, args, [userAddress]) => {
    const limit = Number(args);
    const res = await makeRequest(Routes.Get, { address: userAddress.substring(2), limit })
    if (res.length > 0) {
        print([textLine({ words: [textWord({ characters: `Last ${limit} messages:` })] })]);
        res.map(async (val) => {
            const message = await decryptMessage(val.payload, userAddress);
            const date = timeConverter(val.ts)
            print([textLine({ words: [textWord({ characters: `Date - ${date}` })] })]);
            print([textLine({ words: [textWord({ characters: `Sender -  ${val.name} (Address - ${val.from_address})` })] })]);
            print([textLine({ words: [textWord({ characters: `Message -   ${message}` })] })]);
            print([textLine({ words: [textWord({ characters: "--------------------------------------------" })] })]);
        })
    } else {
        print([textLine({ words: [textWord({ characters: `There is no messages for you` })] })]);
    }
})

const membersWorker = createWorker(async ({ print }) => {
    const list = (await getWhitelist());
    print([textLine({ words: [textWord({ characters: "Current addresses in chat: " })] })]);
    list.forEach((val) => {
        print([textLine({ words: [textWord({ characters: `-  ${val.name} - ${val.address}` })] })]);
    })
}, "Something went wrong while fetching addresses")


const ChatMap =
{
    help: helpWorker,
    login: loginWorker,
    send: sendWorker,
    load: loadWorker,
    members: membersWorker,
    ...commonOperators
}

const Parse = parser(ChatMap)

export default Parse;

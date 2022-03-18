import {
    textLine,
    textWord,
} from 'crt-terminal';
import messages from '../../Messages/Messages';
import { getOpenKey, signData, decryptMessage } from "../WEB3/chat/metamaskAPI"
import { makeRequest, getWhitelist, encryptMessage, checkAccounts, GTON_MINIMUM } from "./utils"
import commonOperators, { parser, createWorker, timeConverter } from '../common';
import balance from '../WEB3/Balance';
import { fantomRpc, gtonAddress } from '../../config/config';
// Func Router 
async function validateBalance(address: string) {
    const userBalance = await balance(address, gtonAddress, fantomRpc);
    if(userBalance.lt(GTON_MINIMUM)) {
        throw new Error("You don't have enought GTON on your balance")
    }
}
enum Routes {
    Login = "register",
    Send = "send",
    SendPrivate = "send_private",
    Get = "get",
    GetPrivate = "get_private",
    FromUser = "from_users",
    List = "whitelist"
}

const helpWorker = ({ print }) => {
    print([textLine({ words: [textWord({ characters: messages.chatHelpText })] })]);
}

enum SendArgs {
    dm = "dm",
    all = "all"
}

const sendWorker = createWorker(async ({ print }, args, [userAddress]) => {
    await validateBalance(userAddress);
    const type = args.split(" ")[0]
    if(!(type in SendArgs)) {
        throw Error("Invalid message type passed. Examples: \n - send dm User123 Hi bro \n - send all Hello to everyone!")
    }
    const slice = type === SendArgs.dm ? 2 : 1
    const message = args.split(" ").slice(slice).join(" ").trim()
    const list = await getWhitelist();
    let downgrade
    let whitelist
    if(type === SendArgs.dm) {
        const username = args.split(" ")[1];
        const i = list.findIndex(e => e.name.toLowerCase() === username.toLowerCase());
        if(i < 0) throw new Error("User does not exists");
        [whitelist, downgrade] = await checkAccounts([list[i]]);
        if(whitelist.length === 0) throw new Error("User does not have enough gton to receive message");
    } else {
        [whitelist, downgrade] = await checkAccounts(list);
    }
    const payload = whitelist.map(e => {
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
    if(type === SendArgs.dm) {
        await makeRequest(Routes.SendPrivate, { sign: sign.substring(2), payload: payload[0] })
    } else {
        await makeRequest(Routes.Send, { downgrade, sign: sign.substring(2), payload })
    }
    print([textLine({ words: [textWord({ characters: "Succesfully sent message" })] })]);
})

const loginWorker = createWorker(async ({ print }, args, [userAddress]) => {
    await validateBalance(userAddress)
    const name = (args.split(" ")[0]).trim();
    const openKey = await getOpenKey(userAddress)
    const sign = await signData(openKey, userAddress)
    await makeRequest(Routes.Login, { open_key: openKey, sign: sign.substring(2), name })
    print([textLine({ words: [textWord({ characters: "Succesfully logged in" })] })]);
}, "Something went wrong while registering")

const loadWorker = createWorker(async ({ print }, args, [userAddress]) => {
    const argArray = args.split(" ");
    const [type, lim] = argArray
    if(!(type in SendArgs)) {
        throw Error("Invalid message type passed. Examples: \n - send dm User123 Hi bro \n - send all Hello to everyone!")
    }
    const limit = Number(lim);
    let res
    if(type === SendArgs.dm) {
        res = await makeRequest(Routes.GetPrivate, { address: userAddress.substring(2), limit })
    } else {
        res = await makeRequest(Routes.Get, { address: userAddress.substring(2), limit })
    }
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
        print([textLine({ words: [textWord({ characters: `-  ${val.name} - 0x${val.address}` })] })]);
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

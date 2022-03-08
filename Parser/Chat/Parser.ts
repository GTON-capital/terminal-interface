import {
    textLine,
    textWord,
} from 'crt-terminal';
import messages from '../../Messages/Messages';
import { getOpenKey, signData } from "../WEB3/chat/metamaskAPI"
import { makeRequest, getWhitelist, encryptMessage, payloadToString } from "./utils"
import commonOperators, { parser, createWorker } from '../common';
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

const sendWorker = createWorker(async ({ print }, msg) => {
    // const list = await getWhitelist();
    const message = msg.trim();
    console.log(message);
    const list = [
        {
            "id": 18,
            "address": "b7d52483f9ae624054a297dd87bcd882a585163b",
            "name": "Nikitos_huesos",
            "open_key": "XftlVcuzujtVxzlPqjrY/bMDCCmLh135bI0YEwPM/B4="
        },
        {
            "id": 19,
            "address": "5bd8ee8bde88c8a48743cd3160983b3eb60c14b8",
            "name": "dev ms",
            "open_key": "+g47ZqlI6mvEBFVmKDPK+vnJuAcbvmLEEdA1XpTDv2o="
        },
        {
            "id": 20,
            "address": "7edfa2bc7b74debb2544ccd82a9114be36a92da7",
            "name": "test",
            "open_key": "EGl8WNUy9lqXWaNBFETeiWTiYndzbYOr1xz6D2IXrmk="
        }
    ]
    const payload = list.map(e => {
        const sign = encryptMessage(message, e.open_key);
        return {
            payload: sign.substring(2),
            to_address: e.address
        }
    })
    let signPayload = ""
    payload.forEach(e => {
        signPayload += e.to_address+e.payload
    })
    const mesg = `0x${Buffer.from(signPayload, 'utf8').toString('hex')}`;

    const sign = await signData(mesg)
    console.log(sign);
    
    await makeRequest(Routes.Send, { downgrade: [], sign, payload })
    print([textLine({ words: [textWord({ characters: "Available bond types: " })] })]);
})

const loginWorker = createWorker(async ({ print }, args, [userAddress]) => {
    const addresses = (await getWhitelist()).map(e => e.address);
    if (userAddress in addresses) {
        throw new Error();
    }
    const name = (args.split(" ")[0]).trim();
    const openKey = await getOpenKey()
    console.log(openKey);
    const sign = await signData(openKey)
    console.log(sign);
    await makeRequest(Routes.Login, { open_key: openKey, sign: sign.substring(2), name })
    print([textLine({ words: [textWord({ characters: "Available bond types: " })] })]);
}, "Something went wrong while registering")

const loadWorker = createWorker(async ({ print }, args, [userAddress]) => {
    const limit = args;
    const res = await makeRequest(Routes.Get, { address: userAddress, limit })
    print([textLine({ words: [textWord({ characters: `Last ${limit} messages:` })] })]);
    res.forEach((val) => {
        // 2022-02-24T12:25:46.362826
        const date = val.ts.split(/[T.]*$/)
        print([textLine({ words: [textWord({ characters: `Date - ${date[0]} ${date[1]}` })] })]);
        print([textLine({ words: [textWord({ characters: `Sender -  ${val.name} (Address - ${val.from_address})` })] })]);
        print([textLine({ words: [textWord({ characters: `Message -   ${val.paylaod}` })] })]);
        print([textLine({ words: [textWord({ characters: "--------------------------------------------" })] })]);
    })
})

const membersWorker = createWorker(async ({ print }) => {
    const list = await getWhitelist();
    print([textLine({ words: [textWord({ characters: "Current addresses in chat: " })] })]);
    list.forEach((val) => {
        print([textLine({ words: [textWord({ characters: `-  ${val}` })] })]);
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

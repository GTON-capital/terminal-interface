import {
    textLine,
    textWord,
} from 'crt-terminal';
import messages from '../../Messages/Messages';
import { getOpenKey, signData } from "../WEB3/chat/metamaskAPI"
import { makeRequest, getWhitelist } from "./utils"
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

const sendWorker = createWorker(async ({ print }, args) => {
    print([textLine({ words: [textWord({ characters: "Available bond types: " })] })]);
})

const loginWorker = createWorker(async ({ print }, args, [userAddress]) => {
    const addresses = await getWhitelist();
    if(userAddress in addresses) {
        throw new Error();
    }
    const name = (args.split(" ")[0]).trim();
    const openKey = await getOpenKey()
    const sign = await signData(openKey)
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

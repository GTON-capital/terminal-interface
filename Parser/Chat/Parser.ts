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

const loginWorker = createWorker(async ({ print }, args) => {
    // TODO check if user is already logged in

    const name = (args.split(" ")[0]).trim();
    const openKey = await getOpenKey()
    const sign = await signData(openKey)
    const data = await makeRequest(Routes.Login, { open_key: openKey, sign: sign.substring(2), name })
    print([textLine({ words: [textWord({ characters: "Available bond types: " })] })]);
}, "Something went wrong while registering")

const loadWorker = createWorker(async ({ print }, args, [userAddress]) => {
    print([textLine({ words: [textWord({ characters: "Available bond types: " })] })]);
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

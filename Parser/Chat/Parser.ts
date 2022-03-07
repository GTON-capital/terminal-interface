import {
    textLine,
    textWord,
    anchorWord
} from 'crt-terminal';
import BigNumber from 'bignumber.js';
import messages from '../../Messages/Messages';
import {getOpenKey} from "../WEB3/chat/metamaskAPI"
import notFoundStrings from '../../Errors/notfound-strings'
import { fromWei, toWei } from '../WEB3/API/balance';
import {  } from '../../config/config';
import {makeRequest} from "./utils"
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
    const name = ""
    const open_key = await getOpenKey()
    // const data = await makeRequest(Routes.Login, {open_key, sign, name})
    print([textLine({ words: [textWord({ characters: "Available bond types: " })] })]);
})

const loadWorker = createWorker(async ({ print }, args) => {
    print([textLine({ words: [textWord({ characters: "Available bond types: " })] })]);
})

const membersWorker = createWorker(async ({ print }, args) => {
    print([textLine({ words: [textWord({ characters: "Available bond types: " })] })]);
})


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

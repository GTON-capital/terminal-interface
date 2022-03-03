import {
    textLine,
    textWord,
    anchorWord
} from 'crt-terminal';
import BigNumber from 'bignumber.js';
import messages from '../../Messages/Messages';
import notFoundStrings from '../../Errors/notfound-strings'
import { fromWei, toWei } from '../WEB3/API/balance';
import {  } from '../../config/config';
import commonOperators, { parser } from '../common';
// Func Router 

const helpWorker = ({ print }) => {
    print([textLine({ words: [textWord({ characters: messages.chatHelpText })] })]);
}

const sendWorker = ({ lock, loading, print }) => {
    print([textLine({ words: [textWord({ characters: "Available bond types: " })] })]);
}

const loginWorker = ({ lock, loading, print }) => {
    print([textLine({ words: [textWord({ characters: "Available tokens: " })] })]);
}

const loadWorker = ({ lock, loading, print }) => {
    const { print } = eventQueue.handlers;
    print([textLine({ words: [textWord({ characters: "Available tokens: " })] })]);

}
const membersWorker = ({ lock, loading, print }) => {
    const { print } = eventQueue.handlers;
    print([textLine({ words: [textWord({ characters: "Available tokens: " })] })]);

}


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

import {
    textLine,
    textWord,
} from 'crt-terminal';
import messages from '../../Messages/Messages';
import { getOpenKey, signData, decryptMessage } from "../WEB3/chat/metamaskAPI"
import { makeRequest, getWhitelist, encryptMessage, checkAccounts, GTON_THERSHOLD, ListItem } from "./utils"
import commonOperators, { parser, createWorker, timeConverter, printLink } from '../common';
import balance from '../WEB3/Balance';
import { fantomRpc, gtonMainnetAddress } from '../../config/config';
// Func Router 
async function validateBalance(address: string) {
    const userBalance = await balance(address, gtonMainnetAddress, fantomRpc);
    if (userBalance.lt(GTON_THERSHOLD)) {
        throw new Error("You don't have enought GTON on your balance")
    }
}

function getUserByArg(list: ListItem[], arg: string): ListItem {
    const lowerArg = arg.toLowerCase()
    const i = list.findIndex(e => e.name.toLowerCase() === lowerArg
         || e.address.toLowerCase() === lowerArg.substring(2))

    if (i < 0) throw new Error("User does not exists");
    return list[i]
}

function getUserByAddress(list: ListItem[], address: string): ListItem {
    const i = list.findIndex(e => e.address.toLowerCase() === address.substring(2).toLowerCase())
    if (i < 0) throw new Error("You are not whitelisted. Login first");

    return list[i]
}

function generatePrivateChat(first: string, second: string): string {
    return first.toLowerCase() > second.toLowerCase() ? first + second : second + first;
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

const angelWorker = ({ print }) => {
    print([textLine({ words: [textWord({ characters: `To participate in angel program complete the steps below
    1. Register in cli chat via command ‘login <name>’
    2. Fill the form on the link below
    3.  Chech for your invitation via command ‘load dm 1000 gton_angels’ you will receive it if you are a valid candidate to a program` })] })]);
    printLink(print, "Form", " https://3dgmrit6mlr.typeform.com/to/T8WQmpx1 ")
}

enum SendArgs {
    dm = "dm",
    all = "all"
}

const sendWorker = createWorker(async ({ print }, args, [userAddress]) => {
    await validateBalance(userAddress);
    const type = args.split(" ")[0]
    if (!(type in SendArgs)) {
        throw Error("Invalid message type passed. Examples: \n - send dm User123 Hi bro \n - send all Hello to everyone!")
    }
    const slice = type === SendArgs.dm ? 2 : 1
    const message = args.split(" ").slice(slice).join(" ").trim()
    const list = await getWhitelist();
    let downgrade
    let whitelist
    let chatName = "angels"
    if (type === SendArgs.dm) {
        const arg = args.split(" ")[1];
        const receiver = getUserByArg(list, arg);
        const sender = getUserByAddress(list, userAddress);
        chatName = generatePrivateChat(sender.address, receiver.address);
        [whitelist, downgrade] = await checkAccounts([receiver, sender]);
        if (whitelist.length === 0) throw new Error("User does not have enough gton to receive message");
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
    await makeRequest(Routes.Send, { downgrade, sign: sign.substring(2), chat_name: chatName, payload })
    print([textLine({ words: [textWord({ characters: "Succesfully sent message" })] })]);
})

const loginWorker = createWorker(async ({ print }, args, [userAddress]) => {
    await validateBalance(userAddress)
    const name = (args.split(" ")[0]).trim();
    const openKey = await getOpenKey(userAddress)
    const sign = await signData(openKey, userAddress)
    await makeRequest(Routes.Login, { open_key: openKey, sign: sign.substring(2), name })
    print([textLine({ words: [textWord({ characters: "Succesfully logged in" })] })]);
})

const loadWorker = createWorker(async ({ print }, args, [userAddress]) => {
    const argArray = args.split(" ");
    const [type, lim] = argArray
    if (!(type in SendArgs)) {
        throw Error("Invalid message type passed. Examples: \n - send dm User123 Hi bro \n - send all Hello to everyone!")
    }
    const limit = Number(lim);
    if(!limit) {
        throw Error("Please specify the amount")
    }
    let res
    const sender = userAddress.substring(2).toLowerCase()
    if (type === SendArgs.dm) {
        const list = await getWhitelist();
        const arg = argArray[2];
        const receiver = getUserByArg(list, arg);
        const chatName = generatePrivateChat(sender, receiver.address);
        res = await makeRequest(Routes.Get, { address: sender, chat_name: chatName, address_from: receiver.address, limit })
    } else {
        res = await makeRequest(Routes.Get, { address: sender, limit, chat_name: "angels", })
    }
    if (res.length > 0) {
        print([textLine({ words: [textWord({ characters: `Last ${limit} messages:` })] })]);
        res.map(async (val) => {
            const message = await decryptMessage(val.payload, userAddress);
            const date = timeConverter(val.ts)
            print([textLine({ words: [textWord({ characters: `Date - ${date}` })] })]);
            print([textLine({ words: [textWord({ characters: `Sender -  ${val.name} (Address - 0x${val.from_address})` })] })]);
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
    angels: angelWorker,
    login: loginWorker,
    send: sendWorker,
    load: loadWorker,
    members: membersWorker,
    ...commonOperators
}

const Parse = parser(ChatMap)

export default Parse;

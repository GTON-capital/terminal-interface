import {
    encrypt,
} from 'eth-sig-util';
import {ethers} from "ethers";
import { gtonAddress } from '../../config/config';
import { toWei } from '../WEB3/API/balance';
import balance from '../WEB3/Balance';

export const GTON_MINIMUM = toWei(1)
export const messengerUrl = "https://mailbox.cli.gton.capital/api/mailbox/"
const headers = {
    "Content-type": "application/json"
}
export type ListItem = { id: number, address: string, open_key: string, name: string }

function stringifiableToHex(value) {
    return ethers.utils.hexlify(Buffer.from(JSON.stringify(value)));
}

export const encryptMessage = (message: string, openKey: string): string => {
    const res = stringifiableToHex(
        encrypt(
            openKey,
            { data: message },
            'x25519-xsalsa20-poly1305',
        ),
    );
    return res;
}

export const makeRequest = async (route: string, body: Record<string, any>) => {
    const res = await fetch(messengerUrl + route, {
        method: "POST",
        body: JSON.stringify(body),
        headers
    })
    const resBody = await res.json()
    return resBody
}

export const getWhitelist = async (): Promise<ListItem[]> => {
    const res = await makeRequest("whitelist", {});
    return res;
}

export const checkAccounts = async (list: ListItem[]): Promise<Array<ListItem[] | string[]>> => {
    const req = list.map(e => balance(`0x${e.address}`, gtonAddress))
    const res = await Promise.all(req)
    const downgrade = []
    const whitelist = []
    res.forEach( (item, index) =>  {
        if(item.gte(GTON_MINIMUM)) {
            whitelist.push(list[index])
        } else {
            downgrade.push(list[index].address)
        }
    })
    return [whitelist, downgrade];
}


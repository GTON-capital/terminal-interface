import {
    encrypt,
} from 'eth-sig-util';
import { ethers } from "ethers";

export const messengerUrl = "https://mailbox.cli.gton.capital/api/mailbox/"
const headers = {
    "Content-type": "application/json"
}
function stringifiableToHex(value) {
    return ethers.utils.hexlify(Buffer.from(JSON.stringify(value)));
}

export type User = { id: number, address: string, open_key: string, name: string }

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

export const getWhitelist = async (): Promise<User[]> => {
    const res = await makeRequest("whitelist", {});
    return res;
}


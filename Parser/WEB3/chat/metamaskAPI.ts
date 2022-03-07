declare const window: any;

export const getOpenKey = async (): Promise<string> => {
    const accounts = await window.ethereum
    .request({ method: 'eth_requestAccounts' })
    const res = await window.ethereum
      .request({
        method: 'eth_getEncryptionPublicKey',
        params: [accounts[0]], // you must have access to the specified account
      })
    return res;
};
export const signData = async (data: string): Promise<string> => {
    const accounts = await window.ethereum
    .request({ method: 'eth_requestAccounts' })
    const res = await window.ethereum
      .request({
        method: 'personal_sign',
        params: [data, accounts[0]], // you must have access to the specified account
      })
    return res;
};
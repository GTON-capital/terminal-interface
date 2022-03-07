declare const window: any;

export const getOpenKey = async (): Promise<string> => {
    const accounts = await window.ethereum
    .request({ method: 'eth_requestAccounts' })
    console.log(accounts);
    const res = await window.ethereum
      .request({
        method: 'eth_getEncryptionPublicKey',
        params: [accounts[0]], // you must have access to the specified account
      })
    console.log(res);
    return res;
};
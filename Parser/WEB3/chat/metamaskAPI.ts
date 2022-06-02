declare const window: any;

export const getOpenKey = async (address: string): Promise<string> => {

    const res = await window.ethereum
      .request({
        method: 'eth_getEncryptionPublicKey',
        params: [address], // you must have access to the specified account
      })
    return res;
};
export const signData = async (data: string, address: string): Promise<string> => {
    const res = await window.ethereum
      .request({
        method: 'personal_sign',
        params: [data, address], // you must have access to the specified account
      })
    return res;
};
export const decryptMessage = async (data: string, address: string): Promise<string> => {
    const res = await window.ethereum
      .request({
        method: 'eth_decrypt',
        params: [data, address], // you must have access to the specified account
      })
    return res;
};

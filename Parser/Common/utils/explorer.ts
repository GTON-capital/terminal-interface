export function formTxLink(explorerUrl: string, txHash: string): string {
  if (explorerUrl.endsWith('tx/')) {
    return explorerUrl + txHash;
  }

  if (explorerUrl.endsWith('/')) {
    return explorerUrl + 'tx/' + txHash;
  }

  return explorerUrl + '/tx/' + txHash;
}

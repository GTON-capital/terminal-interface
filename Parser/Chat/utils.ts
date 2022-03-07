
export const messengerUrl = "http://a5bffd3b4a14c4a5a85a1e5d01d3a5b6-bc51aedea274507b.elb.eu-west-2.amazonaws.com/api/mailbox/"

export const makeRequest = async (route: string, body: Record<string, string>) => {
    const res = await fetch(messengerUrl+route, {
        method: "POST",
        body: JSON.stringify(body)
    })
    const resBody = await res.json()
    return resBody
}
import { AddTokenWorker, BalanceWorker, SwitchWorker, ConnectMetamaskWorker, HarvestWorker, UnStakeWorker, StakeWorker, GTONRouterMap } from "./GTONCapitalProjects/GTONCapitalRouter"

const ParsePreset = (eventQueue, Search: string): void =>
{
    for (let Command in Search.replace("?", "").split('&'))
    {
        GTONRouterMap[Command](eventQueue, Command); 
    }
}

export { ParsePreset }

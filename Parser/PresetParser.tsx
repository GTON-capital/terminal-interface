import { AddTokenSlave, BalanceSlave, SwitchSlave, ConnectMetamaskSlave, HarvestSlave, UnStakeSlave, StakeSlave, GTONRouterMap } from "./GTONCapitalProjects/GTONCapitalRouter"

const ParsePreset = (eventQueue, Search: string): void =>
{
    for (var Command in Search.replace("?", "").split('&'))
    {
        GTONRouterMap[Command](eventQueue, Command); 
    }
}

export { ParsePreset }
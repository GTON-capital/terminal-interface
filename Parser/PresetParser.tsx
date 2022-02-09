import Parse from "./GTONCapitalProjects/GTONCapitalRouter"

function ParseJoin (eventQueue, Search)
{
    var bool = Parse(eventQueue, "join")
    return bool;
}
function ParseSwitch (eventQueue, Search)
{
    var bool = Parse(eventQueue, "switch")
    return bool;
}
function ParseStake (eventQueue, Search)
{
    var bool = Parse(eventQueue, Search.replace("?", "").replace("=", " ").split('&').toString())
    return bool;
}
export { ParseJoin, ParseSwitch, ParseStake }

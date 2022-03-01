import {
    textLine,
    textWord,
    anchorWord
  } from 'crt-terminal';
  import BigNumber from 'bignumber.js';
  import messages from '../../Messages/Messages';
  import notFoundStrings from '../../Errors/notfound-strings'
  import commonOperators from '../common';

  enum ErrorCodes 
  {
    INVALID_ARGUMENT = "INVALID_ARGUMENT",
    USER_DECLINED_TRANSACTION = 3,
    NOT_ENOUGHT_FUNDS = -32000
  }
  
  const ErrorHandler = (eventQueue, Code, Operation) =>
  {
    const { print } = eventQueue.handlers;
    if(Code == ErrorCodes.INVALID_ARGUMENT) 
    {
      print([textLine({words:[textWord({ characters: "It looks like you specified the quantity incorrectly, for example: " + Operation + " 20, or " + Operation + " all" })]})]);
    }
    if(Code == ErrorCodes.USER_DECLINED_TRANSACTION) 
    {
      print([textLine({words:[textWord({ characters: "User declined transaction" })]})]);
    }
    if(Code == ErrorCodes.NOT_ENOUGHT_FUNDS) 
    {
      print([textLine({words:[textWord({ characters: "You don't have enough funds to buy that many GTON" })]})]);
    }
  }
  
  // Func Router 
  
  const helpWorker = (eventQueue) =>
  {
    const { print } = eventQueue.handlers;
    print([textLine({words:[textWord({ characters: messages.bondingHelpText })]})]);
  }
  

  const activeBondsWorker = async (eventQueue) => 
  {
    const { lock, loading, print } = eventQueue.handlers;
    try
    {
      lock(true);
      loading(true);
  
      print([textLine({words:[textWord({ characters: messages.faucetDeposit })]})]);
  
      loading(false);
      lock(false);
    }
    catch(err)
    {
      print([textLine({words:[textWord({ characters: "" })]})]);
      loading(false);
      lock(false);
    }
  }

  const buyBondWorker = async (eventQueue, token) => {

  }
  
  const BondingMap =
  {
    "active bonds": activeBondsWorker,
    help: helpWorker,
    ...commonOperators
  }
  
  const ArgsFunctions = 
  [
    "stake",
    "unstake",
    "harvest",
    "buy"
  ]
  
  async function Parse(eventQueue, command)
  {
    const { print } = eventQueue.handlers;
    const Command = command.split(' ')[0].trim().toLowerCase();
    // split was replaced by substring because of the buy command, which assumes two parameters
    const Arg = command.substring(command.indexOf(' ')).replace(' ', '');
  
    try
    {
      // Handle incorrect command
      if(!(Command in BondingMap)) throw Error(notFoundStrings[Math.floor(Math.random() * notFoundStrings.length)]);
      if(ArgsFunctions.includes(Command) && Arg === Command) throw Error("You should provide args for calling this function. e.g stake 1");
      BondingMap[Command](eventQueue, Arg.toLowerCase());
    }
    catch(err)
    {
      print([textLine({words:[textWord({ characters: err.message })]})]);
    }
  }
  
  export default Parse;
  
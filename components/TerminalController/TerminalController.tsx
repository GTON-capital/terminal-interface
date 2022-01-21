import React from 'react';
import { useDispatch } from 'react-redux';
import { controllerCommand } from 'redux/terminalController/actions/terminalControllerActions';
import Terminal from 'components/Terminal/Terminal';
import messages, { Prompt } from 'utils/API/messages/messages';
import { isTestnet } from 'config/config';

function TerminalController() {
  const dispatch = useDispatch();

  const handleCommand = (c: string): void => {
    if (!c) return;
    dispatch(controllerCommand(c.trim()));
  };

  return <Terminal banner={messages.banner} prompt={ isTestnet ? Prompt.TESTNET: Prompt.MAINNET} onCommand={handleCommand} />;
}

export default TerminalController;

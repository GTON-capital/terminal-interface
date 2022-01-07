import {
  controllerHelp,
  controllerJoin,
  controllerJoinAccepted,
  controllerMined,
  controllerLinks,
  controllerSwitch,
  controllerStake,
  controllerUnstake,
  controllerBalance,
  controllerFaucet,
  controllerAddToken,
  IUserAction,
} from 'redux/terminalController/actions/terminalControllerUserActions';
import {
  RootControllerActions,
  OptionalActions,
} from 'redux/terminalController/terminalControllerActionTypes';
import join from './join/join';

type UserActions = Record<string, (payload: string[]) => IUserAction>;

type Controller = {
  userActions?: UserActions;
  children: Record<string, Controller> | null;
};

const optionalActions: UserActions = {
  [OptionalActions.MINE]: controllerJoinAccepted,
};

const root: Controller = {
  userActions: {
    [RootControllerActions.HELP]: controllerHelp,
    [RootControllerActions.JOIN]: controllerJoin,
    [RootControllerActions.MINED]: controllerMined,
    [RootControllerActions.LINKS]: controllerLinks,
    [RootControllerActions.STAKE]: controllerStake,
    [RootControllerActions.UNSTAKE]: controllerUnstake,
    [RootControllerActions.SWITCH]: controllerSwitch,
    [RootControllerActions.BALANCE]: controllerBalance,
    [RootControllerActions.FAUCET]: controllerFaucet,
    [RootControllerActions.ADD_TOKEN]: controllerAddToken,
  },
  children: {
    join,
  },
};

export type { Controller };
export { optionalActions };
export default root;

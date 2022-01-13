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

type UserActions = Record<string, (payload: string[]) => IUserAction>;

type Controller = {
  userActions?: UserActions;
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
};

export type { Controller };
export { optionalActions };
export default root;

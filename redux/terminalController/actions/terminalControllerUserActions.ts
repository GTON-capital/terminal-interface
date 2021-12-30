import { ActionType } from '../terminalControllerActionTypes';

export interface IUserAction {
  type: ActionType;
  payload: string[];
}

const controllerHelp = (payload: string[]): IUserAction => ({
  type: ActionType.HELP,
  payload,
});

const controllerJoin = (payload: string[]): IUserAction => ({
  type: ActionType.JOIN,
  payload,
});

const controllerIsGary = (payload: string[]): IUserAction => ({
  type: ActionType.IS_GARY,
  payload,
});

const controllerJoinContinue = (payload: string[]): IUserAction => ({
  type: ActionType.JOIN_CONTINUE,
  payload,
});

const controllerJoinAccepted = (payload: string[]): IUserAction => ({
  type: ActionType.JOIN_ACCEPTED,
  payload,
});

const controllerJoinDenied = (payload: string[]): IUserAction => ({
  type: ActionType.JOIN_DENIED,
  payload,
});

const controllerMined = (payload: string[]): IUserAction => ({
  type: ActionType.MINED,
  payload,
});

const controllerLinks = (payload: string[]): IUserAction => ({
  type: ActionType.LINKS,
  payload,
});
const controllerSwitch = (payload: string[]): IUserAction => ({
  type: ActionType.SWITCH,
  payload,
});
const controllerBalance = (payload: string[]): IUserAction => ({
  type: ActionType.BALANCE,
  payload,
});
const controllerFaucet = (payload: string[]): IUserAction => ({
  type: ActionType.FAUCET,
  payload,
});
const controllerStake = (payload: string[]): IUserAction => ({
  type: ActionType.STAKE,
  payload,
});
const controllerUnstake = (payload: string[]): IUserAction => ({
  type: ActionType.UNSTAKE,
  payload,
});

export type ControllerUserActions = IUserAction;
export {
  controllerBalance,
  controllerFaucet,
  controllerHelp,
  controllerJoin,
  controllerJoinAccepted,
  controllerJoinDenied,
  controllerMined,
  controllerSwitch,
  controllerLinks,
  controllerJoinContinue,
  controllerIsGary,
  controllerUnstake,
  controllerStake,
};

enum ActionType {
  GOTO_ROOT = 'GOTO_ROOT',
  GOTO = 'GOTO',
  ADD_ACTION = 'ADD_ACTION',
  COMMAND = 'COMMAND',
  CONTROLLER_ERROR = 'CONTROLLER_ERROR',
  HELP = 'HELP',
  JOIN = 'JOIN',
  IS_GARY = 'IS_GARY',
  JOIN_CONTINUE = 'JOIN_CONTINUE',
  JOIN_ACCEPTED = 'JOIN_ACCEPTED',
  JOIN_DENIED = 'JOIN_DENIED',
  MINED = 'MINED',
  LINKS = 'LINKS',
  SWITCH = 'SWITCH',
  FAUCET = 'FAUCET',
  BALANCE = 'BALANCE',
  STAKE = 'STAKE',
  UNSTAKE = 'UNSTAKE',
  ADD_TOKEN = 'ADD_TOKEN',
}

enum SystemActions {
  DEFAULT_ACTION = 'defaultAction',
}

enum OptionalActions {
  MINE = 'mine',
}

enum RootControllerActions {
  HELP = 'help',
  JOIN = 'join',
  MINED = 'mined',
  LINKS = 'links',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  SWITCH = 'switch',
  FAUCET = 'faucet',
  BALANCE = 'balance',
  ADD_TOKEN = 'add',
}

enum MineChoiceActions {
  YES = 'mine',
  NO = 'no',
}

enum NotGaryQuestionActions {
  NO = 'no',
}

export {
  ActionType,
  SystemActions,
  OptionalActions,
  RootControllerActions,
  MineChoiceActions,
  NotGaryQuestionActions,
};

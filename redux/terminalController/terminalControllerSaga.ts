import {
  put, call, takeEvery, select,
} from 'redux-saga/effects';
import { getTypedError, TerminalError } from 'utils/API/errors/error-hub';
import { print } from 'redux/terminal/terminalAction';
import { IState } from 'redux/root/rootReducer';
import { IActionCommand } from './actions/terminalControllerActions';
import { SystemActions, ActionType } from './terminalControllerActionTypes';

const parseCommand = (command: string) => command.replaceAll('>', '');

function* controllerUserCommandWorker({ payload }: IActionCommand) {
  try {
    const {
      terminalController: { current },
    } = (yield select()) as IState;
    // can cause bugs (incorrect state check)
    if (!current || !current.userActions) {
      throw new TerminalError({ code: 'COMMAND_NOT_FOUND' });
    }
    const commandString = parseCommand(payload).split(' ');
    const command = commandString[0];
    const args = commandString.slice(1);
    const isMainAction = command in current.userActions;
    const hasDefaultAction = SystemActions.DEFAULT_ACTION in current.userActions;

    if (isMainAction) {
      const func = current.userActions[command];
      yield put(func(args));
    } else if (hasDefaultAction) {
      const func = current.userActions[SystemActions.DEFAULT_ACTION];
      yield put(func(args));
    } else {
      throw new TerminalError({ code: 'COMMAND_NOT_FOUND' });
    }
  } catch (e: any) {
    const { message }: TerminalError = yield call(getTypedError, e);
    yield put(print({ msg: message }));
  }
}

function* watchControllerUserCommand() {
  yield takeEvery(ActionType.COMMAND, controllerUserCommandWorker);
}

export default watchControllerUserCommand;

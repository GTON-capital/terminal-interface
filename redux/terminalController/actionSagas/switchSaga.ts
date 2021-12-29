import { put, call, takeEvery } from 'redux-saga/effects';
import messages from 'utils/API/messages/messages';
import { getTypedError, TerminalError } from 'utils/API/errors/error-hub';
import switchChain from 'utils/API/web3/switch-chain';
import { print, inputLock, loading } from 'redux/terminal/terminalAction';
import { controllerGotoRoot } from '../actions/terminalControllerActions';
import { ActionType } from '../terminalControllerActionTypes';

function* controllerSwitchWorker() {
  try {
    yield put(inputLock(true));
    yield put(loading(true));
    yield call(switchChain);

    yield put(loading(false));
    yield put(print({ msg: messages.chainSwitch }));
    yield put(inputLock(false));
  } catch (e: any) {
    yield put(controllerGotoRoot());
    yield put(loading(false));
    const { message }: TerminalError = yield call(getTypedError, e);
    yield put(print({ msg: message }));
    yield put(inputLock(false));
  }
}

function* watchControllerSwitch() {
  yield takeEvery(ActionType.SWITCH, controllerSwitchWorker);
}

export default watchControllerSwitch;

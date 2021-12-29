import { put, call, takeEvery } from 'redux-saga/effects';
import messages from 'utils/API/messages/messages';
import { getTypedError, TerminalError } from 'utils/API/errors/error-hub';
import faucet from 'utils/API/web3/faucet';
import { print, inputLock, loading } from 'redux/terminal/terminalAction';
import { controllerGotoRoot } from '../actions/terminalControllerActions';
import { ActionType } from '../terminalControllerActionTypes';

function* controllerFaucetWorker() {
  try {
    yield put(inputLock(true));
    yield put(loading(true));
    yield call(faucet);

    yield put(loading(false));
    yield put(print({ msg: messages.faucetDeposit }));
    yield put(inputLock(false));
  } catch (e: any) {
    yield put(controllerGotoRoot());
    yield put(loading(false));
    const { message }: TerminalError = yield call(getTypedError, e);
    yield put(print({ msg: message }));
    yield put(inputLock(false));
  }
}

function* watchControllerFaucet() {
  yield takeEvery(ActionType.FAUCET, controllerFaucetWorker);
}

export default watchControllerFaucet;

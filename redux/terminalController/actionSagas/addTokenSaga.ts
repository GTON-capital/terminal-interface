import { put, call, takeEvery } from 'redux-saga/effects';
import messages from 'utils/API/messages/messages';
import { getTypedError, TerminalError } from 'utils/API/errors/error-hub';
import addToken from 'utils/API/web3/addTokenToMM';
import { print, inputLock, loading } from 'redux/terminal/terminalAction';
import tokenMap from 'utils/API/addToken/addToken';
import { controllerGotoRoot } from '../actions/terminalControllerActions';
import { IUserAction } from '../actions/terminalControllerUserActions';
import { ActionType } from '../terminalControllerActionTypes';

function* controllerAddTokenWorker({ payload }: IUserAction) {
  try {
    yield put(inputLock(true));
    yield put(loading(true));
    const arg = payload[0];
    if (!arg) {
      throw new TerminalError({ code: 'EMPTY_ADDRESS_ARG' });
    }
    console.log(arg);
    const token = tokenMap[arg];
    yield call(addToken, token);
    yield put(loading(false));
    yield put(print({ msg: messages.addToken }));
    yield put(inputLock(false));
  } catch (e: any) {
    yield put(controllerGotoRoot());
    yield put(loading(false));
    const { message }: TerminalError = yield call(getTypedError, e);
    yield put(print({ msg: message }));
    yield put(inputLock(false));
  }
}

export default function* watchControllerAddToken() {
  yield takeEvery(ActionType.ADD_TOKEN, controllerAddTokenWorker);
}

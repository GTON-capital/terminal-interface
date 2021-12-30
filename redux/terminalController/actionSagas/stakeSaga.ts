import { put, call, takeEvery } from 'redux-saga/effects';
import messages from 'utils/API/messages/messages';
import { toWei } from 'utils/API/balance/balance';
import { getTypedError, TerminalError } from 'utils/API/errors/error-hub';
import { stake, unstake } from 'utils/API/web3/stake';
import { print, inputLock, loading } from 'redux/terminal/terminalAction';
import { BigNumber } from 'ethers';
import { controllerGotoRoot } from '../actions/terminalControllerActions';
import { IUserAction } from '../actions/terminalControllerUserActions';
import { ActionType } from '../terminalControllerActionTypes';

function* controllerUnstakeWorker({ payload }: IUserAction) {
  try {
    yield put(inputLock(true));
    yield put(loading(true));
    const arg = payload[0];
    if (!arg) {
      throw new TerminalError({ code: 'EMPTY_AMOUNT_ARG' });
    }
    const amount = toWei(BigNumber.from(arg));
    const txnHash: string = yield call(unstake, amount);
    yield put(loading(false));
    yield put(print({ msg: messages.stake('unstaked', arg, txnHash) }));
    yield put(inputLock(false));
  } catch (e: any) {
    yield put(controllerGotoRoot());
    yield put(loading(false));
    const { message }: TerminalError = yield call(getTypedError, e);
    yield put(print({ msg: message }));
    yield put(inputLock(false));
  }
}

function* controllerStakeWorker({ payload }: IUserAction) {
  try {
    yield put(inputLock(true));
    yield put(loading(true));
    const arg = payload[0];
    if (!arg) {
      throw new TerminalError({ code: 'EMPTY_AMOUNT_ARG' });
    }
    const amount = toWei(BigNumber.from(arg));
    const txnHash: string = yield call(stake, amount);
    yield put(loading(false));
    yield put(print({ msg: messages.stake('unstaked', arg, txnHash) }));
    yield put(inputLock(false));
  } catch (e: any) {
    yield put(controllerGotoRoot());
    yield put(loading(false));
    const { message }: TerminalError = yield call(getTypedError, e);
    yield put(print({ msg: message }));
    yield put(inputLock(false));
  }
}

export function* watchControllerStake() {
  yield takeEvery(ActionType.UNSTAKE, controllerUnstakeWorker);
}
export function* watchControllerUnstake() {
  yield takeEvery(ActionType.STAKE, controllerStakeWorker);
}

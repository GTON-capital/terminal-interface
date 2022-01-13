import { put, call, takeEvery } from 'redux-saga/effects';
import messages from 'utils/API/messages/messages';
import { fromWei, addressMap } from 'utils/API/balance/balance';
import { getTypedError, TerminalError } from 'utils/API/errors/error-hub';
import balance from 'utils/API/web3/balance';
import { print, inputLock, loading } from 'redux/terminal/terminalAction';
import { BigNumber } from 'bignumber.js';
import { controllerGotoRoot } from '../actions/terminalControllerActions';
import { IUserAction } from '../actions/terminalControllerUserActions';
import { ActionType } from '../terminalControllerActionTypes';

function* controllerBalanceWorker({ payload }: IUserAction) {
  try {
    yield put(loading(true));
    const nameOrAddress = payload[0];
    let address;
    if (nameOrAddress in addressMap) {
      address = addressMap[nameOrAddress];
    } else {
      address = nameOrAddress;
    }
    if (!address) {
      throw new TerminalError({ code: 'EMPTY_ADDRESS_ARG' });
    }
    const userBalance: BigNumber = yield call(balance, address);
    const etherBalance = fromWei(userBalance);
    yield put(loading(false));
    yield put(print({ msg: messages.balance(etherBalance.toFixed(18)) }));
    yield put(inputLock(false));
  } catch (e: any) {
    yield put(controllerGotoRoot());
    yield put(loading(false));
    const { message }: TerminalError = yield call(getTypedError, e);
    yield put(print({ msg: message }));
    yield put(inputLock(false));
  }
}

function* watchControllerBalance() {
  yield takeEvery(ActionType.BALANCE, controllerBalanceWorker);
}

export default watchControllerBalance;

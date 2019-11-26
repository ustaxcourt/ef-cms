import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { primePropsFromCaseDetailAction } from '../actions/CaseDetail/primePropsFromCaseDetailAction';
import { primePropsFromModalStateAction } from '../actions/modal/primePropsFromModalStateAction';
import { removeCaseDetailPendingItemAction } from '../actions/PendingItems/removeCaseDetailPendingItemAction';
import { saveCaseDetailInternalEditAction } from '../actions/saveCaseDetailInternalEditAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const removeCaseDetailPendingItemSequence = [
  primePropsFromModalStateAction,
  primePropsFromCaseDetailAction,
  removeCaseDetailPendingItemAction,
  setWaitingForResponseAction,
  saveCaseDetailInternalEditAction,
  setCaseAction,
  clearModalAction,
  clearModalStateAction,
  unsetWaitingForResponseAction,
];

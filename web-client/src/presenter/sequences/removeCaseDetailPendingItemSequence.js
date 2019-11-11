import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { primePropsFromCaseDetailAction } from '../actions/CaseDetail/primePropsFromCaseDetailAction';
import { primePropsFromModalStateAction } from '../actions/modal/primePropsFromModalStateAction';
import { removeCaseDetailPendingItemAction } from '../actions/PendingItems/removeCaseDetailPendingItemAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateCaseAction } from '../actions/updateCaseAction';

export const removeCaseDetailPendingItemSequence = [
  primePropsFromModalStateAction,
  primePropsFromCaseDetailAction,
  removeCaseDetailPendingItemAction,
  setWaitingForResponseAction,
  updateCaseAction,
  setCaseAction,
  clearModalAction,
  clearModalStateAction,
  unsetWaitingForResponseAction,
];

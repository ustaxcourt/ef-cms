import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { primePropsFromCaseDetailAction } from '../actions/CaseDetail/primePropsFromCaseDetailAction';
import { primePropsFromModalStateAction } from '../actions/modal/primePropsFromModalStateAction';
import { removeCaseDetailPendingItemAction } from '../actions/PendingItems/removeCaseDetailPendingItemAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const removeCaseDetailPendingItemSequence =
  showProgressSequenceDecorator([
    primePropsFromModalStateAction,
    primePropsFromCaseDetailAction,
    removeCaseDetailPendingItemAction,
    setCaseAction,
    clearModalAction,
    clearModalStateAction,
  ]);

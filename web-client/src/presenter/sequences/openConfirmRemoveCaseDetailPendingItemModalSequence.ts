import { clearModalStateAction } from '../actions/clearModalStateAction';
import { primePropsFromCaseDetailAction } from '../actions/CaseDetail/primePropsFromCaseDetailAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setupConfirmRemoveCaseDetailPendingItemModalAction } from '../actions/PendingItems/setupConfirmRemoveCaseDetailPendingItemModalAction';

export const openConfirmRemoveCaseDetailPendingItemModalSequence = [
  clearModalStateAction,
  primePropsFromCaseDetailAction,
  setupConfirmRemoveCaseDetailPendingItemModalAction,
  setShowModalFactoryAction('ConfirmRemoveCaseDetailPendingItemModal'),
];

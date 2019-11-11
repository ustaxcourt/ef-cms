import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setupConfirmRemoveCaseDetailPendingItemModalAction } from '../actions/PendingItems/setupConfirmRemoveCaseDetailPendingItemModalAction';

export const openConfirmRemoveCaseDetailPendingItemModalSequence = [
  clearModalStateAction,
  setupConfirmRemoveCaseDetailPendingItemModalAction,
  setShowModalFactoryAction('ConfirmRemoveCaseDetailPendingItemModal'),
];

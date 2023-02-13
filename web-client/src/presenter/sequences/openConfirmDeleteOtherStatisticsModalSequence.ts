import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmDeleteOtherStatisticsModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('ConfirmDeleteOtherStatisticsModal'),
];

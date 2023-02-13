import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmDeleteDeficiencyStatisticsModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('ConfirmDeleteDeficiencyStatisticsModal'),
];

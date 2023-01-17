import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openItemizedPenaltiesModalSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('ItemizedPenaltiesModal'),
];

import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setupItemizedPenaltiesModalStateAction } from '../actions/setupItemizedPenaltiesModalStateAction';

export const openItemizedPenaltiesModalSequence = [
  clearModalStateAction,
  setupItemizedPenaltiesModalStateAction,
  setShowModalFactoryAction('ItemizedPenaltiesModal'),
];

import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmReplacePetitionPdfSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('ConfirmReplacePetitionModal'),
];

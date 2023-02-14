import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCorrespondenceToDeleteAction } from '../actions/CorrespondenceDocument/setCorrespondenceToDeleteAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmDeleteCorrespondenceModalSequence = [
  clearModalStateAction,
  setCorrespondenceToDeleteAction,
  setShowModalFactoryAction('DeleteCorrespondenceModal'),
];

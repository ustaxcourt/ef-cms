import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDeletePractitionerDocumentModalStateAction } from '../actions/Practitioners/setDeletePractitionerDocumentModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openDeletePractitionerDocumentConfirmModalSequence = [
  clearModalStateAction,
  setDeletePractitionerDocumentModalStateAction,
  setShowModalFactoryAction('DeletePractitionerDocumentConfirmModal'),
];

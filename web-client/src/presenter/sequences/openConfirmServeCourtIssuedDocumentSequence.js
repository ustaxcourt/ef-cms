import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmServeCourtIssuedDocumentSequence = [
  setRedirectUrlAction,
  setDocumentIdAction,
  clearModalStateAction,
  setShowModalFactoryAction('ConfirmInitiateCourtIssuedDocumentServiceModal'),
];

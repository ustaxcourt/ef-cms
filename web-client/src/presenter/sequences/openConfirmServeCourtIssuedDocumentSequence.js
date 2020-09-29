import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmServeCourtIssuedDocumentSequence = [
  setRedirectUrlAction,
  setDocketEntryIdAction,
  clearModalStateAction,
  setShowModalFactoryAction('ConfirmInitiateCourtIssuedDocumentServiceModal'),
];

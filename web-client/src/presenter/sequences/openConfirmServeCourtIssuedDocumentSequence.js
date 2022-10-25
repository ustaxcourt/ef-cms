import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setupConsolidatedCasesAction } from '../actions/CaseConsolidation/setupConsolidatedCasesAction';

export const openConfirmServeCourtIssuedDocumentSequence = [
  setRedirectUrlAction,
  setDocketEntryIdAction,
  clearModalStateAction,
  setupConsolidatedCasesAction,
  setShowModalFactoryAction('ConfirmInitiateCourtIssuedDocumentServiceModal'),
];

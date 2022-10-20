import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setupConsolidatedCasesAction } from '../actions/CaseConsolidation/setupConsolidatedCasesAction';
import { shouldSetupConsolidatedCasesAction } from '../actions/CaseConsolidation/shouldSetupConsolidatedCasesAction';

export const openConfirmServeCourtIssuedDocumentSequence = [
  setRedirectUrlAction,
  setDocketEntryIdAction,
  clearModalStateAction,
  shouldSetupConsolidatedCasesAction,
  {
    no: [],
    yes: [setupConsolidatedCasesAction],
  },
  setShowModalFactoryAction('ConfirmInitiateCourtIssuedDocumentServiceModal'),
];

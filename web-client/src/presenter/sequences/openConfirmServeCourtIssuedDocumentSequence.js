import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setMultiDocketingCheckboxesAction } from '../actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { shouldSetupConsolidatedCasesAction } from '../actions/CaseConsolidation/shouldSetupConsolidatedCasesAction';

export const openConfirmServeCourtIssuedDocumentSequence = [
  setRedirectUrlAction,
  setDocketEntryIdAction,
  clearModalStateAction,
  shouldSetupConsolidatedCasesAction,
  {
    no: [],
    yes: [setMultiDocketingCheckboxesAction],
  },
  setShowModalFactoryAction('ConfirmInitiateCourtIssuedFilingServiceModal'),
];

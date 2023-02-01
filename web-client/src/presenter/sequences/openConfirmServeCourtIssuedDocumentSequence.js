import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { isDocketEntryMultiDocketableAction } from '../actions/CaseConsolidation/isDocketEntryMultiDocketableAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setMultiDocketingCheckboxesAction } from '../actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openConfirmServeCourtIssuedDocumentSequence = [
  setRedirectUrlAction,
  setDocketEntryIdAction,
  clearModalStateAction,
  isDocketEntryMultiDocketableAction,
  {
    no: [],
    yes: [
      getConsolidatedCasesByCaseAction,
      setConsolidatedCasesForCaseAction,
      setMultiDocketingCheckboxesAction,
    ],
  },
  setShowModalFactoryAction('ConfirmInitiateCourtIssuedFilingServiceModal'),
];

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setupConsolidatedCasesAction } from '../actions/CaseConsolidation/setupConsolidatedCasesAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/validateCourtIssuedDocketEntryAction';

export const openConfirmInitiateServiceModalSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateCourtIssuedDocketEntryAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      clearModalStateAction,
      getConsolidatedCasesByCaseAction,
      setConsolidatedCasesForCaseAction,
      setupConsolidatedCasesAction,
      setShowModalFactoryAction('ConfirmInitiateServiceModal'),
    ],
  },
];

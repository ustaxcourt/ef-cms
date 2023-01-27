import { clearModalAction } from '../actions/clearModalAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setDocumentToDisplayFromDocumentIdAction } from '../actions/setDocumentToDisplayFromDocumentIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const saveDocumentForQCSequence = [
  clearModalAction,
  unsetWaitingForResponseAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  followRedirectAction, // check for necessity of followRedirection in context of saving a filing
  {
    default: [navigateToCaseDetailAction],
    success: [
      getCaseAction,
      setCaseAction,
      getConsolidatedCasesByCaseAction,
      setConsolidatedCasesForCaseAction,
      setDocumentToDisplayFromDocumentIdAction,
    ],
  },
];

import { clearFormAction } from '../actions/clearFormAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getFilterCurrentJudgeUsersAction } from '../actions/getFilterCurrentJudgeUsersAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setCourtIssuedDocumentInitialDataAction } from '../actions/CourtIssuedDocketEntry/setCourtIssuedDocumentInitialDataAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setDefaultServiceStampAction } from '../actions/CourtIssuedDocketEntry/setDefaultServiceStampAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setIsEditingDocketEntryAction } from '../actions/setIsEditingDocketEntryAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddCourtIssuedDocketEntrySequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator([
      setCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      clearFormAction,
      setRedirectUrlAction,
      getUsersInSectionAction({ section: 'judge' }),
      getFilterCurrentJudgeUsersAction,
      setUsersByKeyAction('judges'),
      getCaseAction,
      setCaseAction,
      getConsolidatedCasesByCaseAction,
      setConsolidatedCasesForCaseAction,
      setDocketEntryIdAction,
      setCourtIssuedDocumentInitialDataAction,
      setDefaultServiceStampAction,
      generateCourtIssuedDocumentTitleAction,
      setIsEditingDocketEntryAction(false),
      setCurrentPageAction('CourtIssuedDocketEntry'),
    ]),
    unauthorized: [redirectToCognitoAction],
  },
];

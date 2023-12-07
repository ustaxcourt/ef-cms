import { clearFormAction } from '../actions/clearFormAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getFilterCurrentJudgeUsersAction } from '../actions/getFilterCurrentJudgeUsersAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Public/goToLoginSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCourtIssuedDocumentInitialDataAction } from '../actions/CourtIssuedDocketEntry/setCourtIssuedDocumentInitialDataAction';
import { setDefaultServiceStampAction } from '../actions/CourtIssuedDocketEntry/setDefaultServiceStampAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setIsEditingDocketEntryAction } from '../actions/setIsEditingDocketEntryAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddCourtIssuedDocketEntrySequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator([
      setupCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      clearFormAction,
      setRedirectUrlAction,
      getUsersInSectionAction({ section: 'judge' }),
      getFilterCurrentJudgeUsersAction,
      setUsersByKeyAction('judges'),
      getCaseAction,
      setCaseAction,
      setDocketEntryIdAction,
      setCourtIssuedDocumentInitialDataAction,
      setDefaultServiceStampAction,
      generateCourtIssuedDocumentTitleAction,
      setIsEditingDocketEntryAction(false),
      setupCurrentPageAction('CourtIssuedDocketEntry'),
    ]),
    unauthorized: [gotoLoginSequence],
  },
];

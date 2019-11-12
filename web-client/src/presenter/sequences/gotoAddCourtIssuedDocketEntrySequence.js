import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddCourtIssuedDocketEntrySequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      setCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      setBaseUrlAction,
      clearFormAction,
      getCaseAction,
      setCaseAction,
      setDocumentIdAction,
      setCurrentPageAction('AddCourtIssuedDocketEntry'),
    ],
    unauthorized: [redirectToCognitoAction],
  },
];

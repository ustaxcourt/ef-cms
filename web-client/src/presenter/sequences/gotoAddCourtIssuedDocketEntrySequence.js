import { clearFormAction } from '../actions/clearFormAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCourtIssuedDocumentInitialDataAction } from '../actions/CourtIssuedDocketEntry/setCourtIssuedDocumentInitialDataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultServiceStampAction } from '../actions/CourtIssuedDocketEntry/setDefaultServiceStampAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddCourtIssuedDocketEntrySequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      setCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      setBaseUrlAction,
      clearFormAction,
      getUsersInSectionAction({ section: 'judge' }),
      setUsersByKeyAction('judgeUsers'),
      getCaseAction,
      setCaseAction,
      setDocumentIdAction,
      setCourtIssuedDocumentInitialDataAction,
      setDefaultServiceStampAction,
      generateCourtIssuedDocumentTitleAction,
      set(state.isEditingDocketEntry, false),
      setCurrentPageAction('CourtIssuedDocketEntry'),
    ],
    unauthorized: [redirectToCognitoAction],
  },
];

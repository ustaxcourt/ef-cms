import { canRequestAccessAction } from '../actions/CaseAssociationRequest/canRequestAccessAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/CaseAssociationRequest/getCaseAssociationAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseAssociationAction } from '../actions/CaseAssociationRequest/setCaseAssociationAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';

const gotoRequestAccess = [
  setCurrentPageAction('Interstitial'),
  set(state.showValidation, false),
  clearAlertsAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  getCaseAssociationAction,
  setCaseAssociationAction,
  canRequestAccessAction,
  {
    proceed: [
      set(state.wizardStep, 'RequestAccess'),
      setCurrentPageAction('RequestAccessWizard'),
    ],
    unauthorized: [navigateToCaseDetailAction],
  },
];

export const gotoRequestAccessSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoRequestAccess,
    unauthorized: [redirectToCognitoAction],
  },
];

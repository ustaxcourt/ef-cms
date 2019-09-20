import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';

const gotoFileDocument = [
  setCurrentPageAction('Interstitial'),
  set(state.showValidation, false),
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  set(state.wizardStep, 'SelectDocumentType'),
  setCurrentPageAction('FileDocumentWizard'),
];

export const gotoFileDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoFileDocument,
    unauthorized: [redirectToCognitoAction],
  },
];

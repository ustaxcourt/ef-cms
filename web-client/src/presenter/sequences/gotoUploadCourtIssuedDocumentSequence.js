import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

const gotoUploadCourtIssuedDocument = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  set(state.form, {
    category: 'Miscellaneous',
    documentTitle: '[anything]',
    documentType: 'MISC - Miscellaneous',
    eventCode: 'MISC',
    scenario: 'Nonstandard B',
  }),
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  setCurrentPageAction('UploadCourtIssuedDocument'),
  unsetWaitingForResponseAction,
];

export const gotoUploadCourtIssuedDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoUploadCourtIssuedDocument],
    unauthorized: [redirectToCognitoAction],
  },
];

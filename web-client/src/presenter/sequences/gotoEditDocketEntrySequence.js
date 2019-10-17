import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { deconstructReceivedAtDateToFormAction } from '../actions/EditDocketRecord/deconstructReceivedAtDateToFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocketEntryFormForDocketEditAction } from '../actions/EditDocketRecord/setDocketEntryFormForDocketEditAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditDocketEntry = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearScansAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  setBaseUrlAction,
  setDocketEntryFormForDocketEditAction,
  deconstructReceivedAtDateToFormAction,
  setDocumentIdAction,
  set(state.currentTab, 'Document Info'),
  setCurrentPageAction('EditDocketEntry'),
];

export const gotoEditDocketEntrySequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditDocketEntry,
    unauthorized: [redirectToCognitoAction],
  },
];

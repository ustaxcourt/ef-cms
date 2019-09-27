import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocketEntryFormForEditAction } from '../actions/setDocketEntryFormForEditAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { state } from 'cerebral';

export const gotoEditDocketEntry = [
  setCurrentPageAction('Interstitial'),
  set(state.showValidation, false),
  clearScansAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  setDocketEntryFormForEditAction,
  setDocumentIdAction,
  set(state.isEditingDocketEntry, true),
  set(state.wizardStep, 'PrimaryDocumentForm'),
  set(state.documentUploadMode, 'scan'),
  set(state.documentSelectedForScan, 'primaryDocumentFile'),
  setCurrentPageAction('AddDocketEntry'),
];

export const gotoEditDocketEntrySequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditDocketEntry,
    unauthorized: [redirectToCognitoAction],
  },
];

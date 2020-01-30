import { chooseMetaTypePathAction } from '../actions/EditDocketRecordEntry/chooseMetaTypePathAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocketEntryMetaFormForEditAction } from '../actions/EditDocketRecordEntry/setDocketEntryMetaFormForEditAction';
import { setDocketEntryMetaTypeAction } from '../actions/EditDocketRecordEntry/setDocketEntryMetaTypeAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditDocketEntryMeta = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearScansAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  setDocketEntryMetaFormForEditAction,
  setDocketEntryMetaTypeAction,
  chooseMetaTypePathAction,
  {
    courtIssued: [generateCourtIssuedDocumentTitleAction],
    document: [],
    noDocument: [],
  },
  setCurrentPageAction('EditDocketEntryMeta'),
];

export const gotoEditDocketEntryMetaSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditDocketEntryMeta,
    unauthorized: [redirectToCognitoAction],
  },
];

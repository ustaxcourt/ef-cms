import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocketEntryMetaFormForEditAction } from '../actions/EditDocketRecordEntry/setDocketEntryMetaFormForEditAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { setDocketEntryMetaTypeAction } from '../actions/EditDocketRecordEntry/setDocketEntryMetaTypeAction';
import { chooseMetaTypePathAction } from '../actions/EditDocketRecordEntry/chooseMetaTypePathAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';

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

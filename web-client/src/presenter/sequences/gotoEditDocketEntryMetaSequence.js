import { chooseMetaTypePathAction } from '../actions/EditDocketRecordEntry/chooseMetaTypePathAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { computeJudgeNameWithTitleAction } from '../actions/computeJudgeNameWithTitleAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { generateTitlePreviewAction } from '../actions/EditDocketRecordEntry/generateTitlePreviewAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getFilterCurrentJudgeUsersAction } from '../actions/getFilterCurrentJudgeUsersAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { initCourtIssuedOrderFormPropsFromEventCodeAction } from '../actions/EditDocketRecordEntry/initCourtIssuedOrderFormPropsFromEventCodeAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultEditDocketEntryMetaTabAction } from '../actions/setDefaultEditDocketEntryMetaTabAction';
import { setDocketEntryMetaFormForEditAction } from '../actions/EditDocketRecordEntry/setDocketEntryMetaFormForEditAction';
import { setDocketEntryMetaTypeAction } from '../actions/EditDocketRecordEntry/setDocketEntryMetaTypeAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

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
    courtIssued: [
      initCourtIssuedOrderFormPropsFromEventCodeAction,
      getUsersInSectionAction({ section: 'judge' }),
      getFilterCurrentJudgeUsersAction,
      setUsersByKeyAction('judges'),
      computeJudgeNameWithTitleAction,
      generateCourtIssuedDocumentTitleAction,
    ],
    document: [updateDocketEntryWizardDataAction, generateTitlePreviewAction],
    noDocument: [],
  },
  setDefaultEditDocketEntryMetaTabAction,
  setCurrentPageAction('EditDocketEntryMeta'),
];

export const gotoEditDocketEntryMetaSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditDocketEntryMeta,
    unauthorized: [redirectToCognitoAction],
  },
];

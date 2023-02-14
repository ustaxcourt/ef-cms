import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { deconstructDatesToFormAction } from '../actions/EditDocketRecord/deconstructDatesToFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocketEntryFormForDocketEditAction } from '../actions/EditDocketRecord/setDocketEntryFormForDocketEditAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setFromPageAction } from '../actions/setFromPageAction';
import { setPdfPreviewUrlForEditPaperFilingAction } from '../actions/EditDocketRecord/setPdfPreviewUrlForEditPaperFilingAction';
import { setupEditPaperFilingAction } from '../actions/setupEditPaperFilingAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const gotoEditPaperFiling = [
  setCurrentPageAction('Interstitial'),
  clearScansAction,
  clearFormAction,
  clearScreenMetadataAction,
  stopShowValidationAction,
  setFromPageAction,
  getCaseAction,
  setCaseAction,
  setDocketEntryIdAction,
  setDocketEntryFormForDocketEditAction,
  deconstructDatesToFormAction,
  updateDocketEntryWizardDataAction,
  setupEditPaperFilingAction,
  setPdfPreviewUrlForEditPaperFilingAction,
  setCurrentPageAction('PaperFiling'),
];

export const gotoEditPaperFilingSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator(gotoEditPaperFiling),
    unauthorized: [redirectToCognitoAction],
  },
];

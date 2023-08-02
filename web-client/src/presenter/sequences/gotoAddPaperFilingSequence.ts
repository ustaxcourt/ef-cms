import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { resetAddPaperFilingAction } from '../actions/resetAddPaperFilingAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetDocketEntryIdAction } from '../actions/unsetDocketEntryIdAction';

export const gotoAddPaperFiling = [
  setupCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearScansAction,
  clearFormAction,
  unsetDocketEntryIdAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  getConsolidatedCasesByCaseAction,
  setConsolidatedCasesForCaseAction,
  resetAddPaperFilingAction,
  setupCurrentPageAction('PaperFiling'),
];

export const gotoAddPaperFilingSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator(gotoAddPaperFiling),
    unauthorized: [redirectToCognitoAction],
  },
];

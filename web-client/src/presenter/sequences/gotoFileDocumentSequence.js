import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/caseConsolidation/getConsolidatedCasesByCaseAction';
import { isConsolidatedCaseAction } from '../actions/FileDocument/isConsolidatedCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/caseConsolidation/setConsolidatedCasesForCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoFileDocument = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  set(state.wizardStep, 'SelectDocumentType'),
  setCurrentPageAction('FileDocumentWizard'),
  isConsolidatedCaseAction,
  {
    no: [],
    yes: [
      getConsolidatedCasesByCaseAction,
      setConsolidatedCasesForCaseAction,
      clearModalStateAction,
      setShowModalFactoryAction('CheckConsolidatedCasesModal'),
    ],
  },
];

export const gotoFileDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoFileDocument,
    unauthorized: [redirectToCognitoAction],
  },
];

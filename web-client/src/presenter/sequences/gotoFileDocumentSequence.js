import { canFileInConsolidatedCasesAction } from '../actions/FileDocument/canFileInConsolidatedCasesAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/caseConsolidation/getConsolidatedCasesByCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/caseConsolidation/setConsolidatedCasesForCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultFilersMapAction } from '../actions/setDefaultFilersMapAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setWizardStepAction } from '../actions/setWizardStepAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoFileDocument = [
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  setDefaultFilersMapAction,
  getCaseAction,
  setCaseAction,
  setWizardStepAction('SelectDocumentType'),
  setCurrentPageAction('FileDocumentWizard'),
  canFileInConsolidatedCasesAction,
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

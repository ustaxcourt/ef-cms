import { getInitialNextStepAction } from '../actions/StartCaseInternal/getInitialNextStepAction';
import { navigateToStartCaseWizardNextStepAction } from '../actions/StartCase/navigateToStartCaseWizardNextStepAction';
import { selectDocumentForScanSequence } from './selectDocumentForScanSequence';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setStartInternalCaseTabAction } from '../actions/StartCaseInternal/setStartInternalCaseTabAction';

export const goBackToStartCaseInternalSequence = [
  setCurrentPageAction('StartCaseInternal'),
  getInitialNextStepAction,
  setStartInternalCaseTabAction,
  navigateToStartCaseWizardNextStepAction,
  selectDocumentForScanSequence,
];

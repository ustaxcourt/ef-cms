import { getInitialNextStepAction } from '../actions/StartCaseInternal/getInitialNextStepAction';
import { navigateToStartCaseWizardNextStepAction } from '../actions/StartCase/navigateToStartCaseWizardNextStepAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const goBackToStartCaseInternalSequence = [
  setCurrentPageAction('StartCaseInternal'),
  getInitialNextStepAction,
  navigateToStartCaseWizardNextStepAction,
];

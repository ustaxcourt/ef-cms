import { canNavigateToReviewPetitionFromPaperScreenAction } from '../actions/StartCaseInternal/canNavigateToReviewPetitionFromPaperScreenAction';
import { getInitialNextStepAction } from '../actions/StartCaseInternal/getInitialNextStepAction';
import { navigateToStartCaseWizardNextStepAction } from '../actions/StartCase/navigateToStartCaseWizardNextStepAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoReviewPetitionFromPaperSequence = [
  canNavigateToReviewPetitionFromPaperScreenAction,
  {
    no: [getInitialNextStepAction, navigateToStartCaseWizardNextStepAction],
    yes: [setCurrentPageAction('ReviewPetitionFromPaper')],
  },
];

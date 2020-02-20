import { canNavigateToReviewSavedPetitionScreenAction } from '../actions/caseDetailEdit/canNavigateToReviewSavedPetitionScreenAction';
import { navigateToDocumentDetailAction } from '../actions/navigateToDocumentDetailAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoReviewSavedPetitionSequence = [
  canNavigateToReviewSavedPetitionScreenAction,
  {
    no: [navigateToDocumentDetailAction],
    yes: [setCurrentPageAction('ReviewSavedPetition')],
  },
];

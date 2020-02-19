import { canNavigateToReviewPetitionFromPaperScreenAction } from '../actions/StartCaseInternal/canNavigateToReviewPetitionFromPaperScreenAction';
import { gotoDashboardSequence } from './gotoDashboardSequence';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoReviewPetitionFromPaperSequence = [
  canNavigateToReviewPetitionFromPaperScreenAction,
  {
    no: [gotoDashboardSequence],
    yes: [setCurrentPageAction('ReviewPetition')],
  },
];

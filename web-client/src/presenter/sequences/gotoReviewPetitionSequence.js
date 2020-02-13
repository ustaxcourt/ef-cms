import { canNavigateToReviewPetitionScreenAction } from '../actions/StartCaseInternal/canNavigateToReviewPetitionScreenAction';
import { gotoDashboardSequence } from './gotoDashboardSequence';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoReviewPetitionSequence = [
  canNavigateToReviewPetitionScreenAction,
  {
    no: [gotoDashboardSequence],
    yes: [setCurrentPageAction('ReviewPetition')],
  },
];

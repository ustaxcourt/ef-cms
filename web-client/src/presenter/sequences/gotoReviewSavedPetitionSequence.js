import { canNavigateToReviewSavedPetitionScreenAction } from '../actions/caseDetailEdit/canNavigateToReviewSavedPetitionScreenAction';
import { getCaseAction } from '../actions/getCaseAction';
import { navigateToDocumentDetailAction } from '../actions/navigateToDocumentDetailAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoReviewSavedPetitionSequence = [
  canNavigateToReviewSavedPetitionScreenAction,
  {
    no: [navigateToDocumentDetailAction],
    yes: [
      getCaseAction,
      setCaseAction,
      setCurrentPageAction('ReviewSavedPetition'),
    ],
  },
];

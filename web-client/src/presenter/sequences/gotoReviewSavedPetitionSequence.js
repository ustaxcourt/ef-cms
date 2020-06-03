import { canNavigateToReviewSavedPetitionScreenAction } from '../actions/caseDetailEdit/canNavigateToReviewSavedPetitionScreenAction';
import { getCaseAction } from '../actions/getCaseAction';
import { navigateToDocumentDetailAction } from '../actions/navigateToDocumentDetailAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setCaseOnFormUsingStateAction } from '../actions/setCaseOnFormUsingStateAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { shouldLoadCaseAction } from '../actions/shouldLoadCaseAction';

export const gotoReviewSavedPetitionSequence = [
  canNavigateToReviewSavedPetitionScreenAction,
  {
    no: [navigateToDocumentDetailAction],
    yes: [
      shouldLoadCaseAction,
      {
        ignore: [setCaseOnFormUsingStateAction],
        load: [getCaseAction, setCaseAction, setCaseOnFormAction],
      },
      setCurrentPageAction('ReviewSavedPetition'),
    ],
  },
];

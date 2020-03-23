import { canNavigateToReviewSavedPetitionScreenAction } from '../actions/caseDetailEdit/canNavigateToReviewSavedPetitionScreenAction';
import { getCaseAction } from '../actions/getCaseAction';
import { navigateToDocumentDetailAction } from '../actions/navigateToDocumentDetailAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setCaseToFormAction } from '../actions/setCaseToFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { shouldLoadCaseAction } from '../actions/shouldLoadCaseAction';

export const gotoReviewSavedPetitionSequence = [
  getCaseAction,
  setCaseOnFormAction,
  setDocumentIdAction,
  canNavigateToReviewSavedPetitionScreenAction,
  {
    no: [navigateToDocumentDetailAction],
    yes: [
      shouldLoadCaseAction,
      {
        ignore: [],
        load: [getCaseAction, setCaseAction, setCaseToFormAction],
      },
      setCurrentPageAction('ReviewSavedPetition'),
    ],
  },
];

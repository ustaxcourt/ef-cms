import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setCaseOnFormUsingStateAction } from '../actions/setCaseOnFormUsingStateAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { shouldLoadCaseAction } from '../actions/shouldLoadCaseAction';

export const gotoReviewSavedPetitionSequence = [
  shouldLoadCaseAction,
  {
    ignore: [setCaseOnFormUsingStateAction],
    load: [getCaseAction, setCaseAction, setCaseOnFormAction],
  },
  setCurrentPageAction('ReviewSavedPetition'),
];

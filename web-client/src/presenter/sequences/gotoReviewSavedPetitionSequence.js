import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setCaseOnFormUsingStateAction } from '../actions/setCaseOnFormUsingStateAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setPetitionIdAction } from '../actions/setPetitionIdAction';
import { shouldLoadCaseAction } from '../actions/shouldLoadCaseAction';

export const gotoReviewSavedPetitionSequence = [
  shouldLoadCaseAction,
  {
    ignore: [setCaseOnFormUsingStateAction],
    load: [getCaseAction, setCaseAction, setCaseOnFormAction],
  },
  setPetitionIdAction,
  setDocumentIdAction,
  setCurrentPageAction('ReviewSavedPetition'),
];

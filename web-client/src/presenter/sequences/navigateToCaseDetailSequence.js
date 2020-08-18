import { getIsOnCaseDetailAction } from '../actions/CaseDetail/getIsOnCaseDetailAction';
import { gotoCaseDetailSequence } from './gotoCaseDetailSequence';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';

export const navigateToCaseDetailSequence = [
  getIsOnCaseDetailAction,
  {
    no: [navigateToCaseDetailAction],
    yes: [gotoCaseDetailSequence],
  },
];

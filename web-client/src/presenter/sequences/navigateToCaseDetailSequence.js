import { getIsOnCaseDetailAction } from '../actions/CaseDetail/getIsOnCaseDetailAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';

import { gotoCaseDetailSequence } from './gotoCaseDetailSequence';

export const navigateToCaseDetailSequence = [
  getIsOnCaseDetailAction,
  {
    no: [navigateToCaseDetailAction],
    yes: [gotoCaseDetailSequence],
  },
];

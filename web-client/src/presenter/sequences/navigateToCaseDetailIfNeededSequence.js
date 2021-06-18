import { getIsOnCaseDetailAction } from '../actions/CaseDetail/getIsOnCaseDetailAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';

export const navigateToCaseDetailIfNeededSequence = [
  getIsOnCaseDetailAction,
  {
    no: [setCaseDetailPageTabFrozenAction, navigateToCaseDetailAction],
    yes: [],
  },
];

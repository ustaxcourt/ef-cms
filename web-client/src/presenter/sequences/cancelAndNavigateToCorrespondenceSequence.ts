import { clearModalAction } from '../actions/clearModalAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';

export const cancelAndNavigateToCorrespondenceSequence = [
  clearModalAction,
  setCaseDetailPageTabActionGenerator('correspondence'),
  setCaseDetailPageTabFrozenAction,
  followRedirectAction,
  {
    default: [navigateToCaseDetailAction],
    success: [],
  },
];

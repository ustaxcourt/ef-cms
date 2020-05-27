import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';

export const cancelAndNavigateToCorrespondenceSequence = [
  clearModalAction,
  setCaseDetailPageTabActionGenerator('correspondence'),
  setCaseDetailPageTabFrozenAction,
  navigateToCaseDetailAction,
];

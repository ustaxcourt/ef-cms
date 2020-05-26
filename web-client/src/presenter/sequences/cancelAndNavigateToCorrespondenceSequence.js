import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseDetailPageTabAction } from '../actions/setCaseDetailPageTabAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';

export const cancelAndNavigateToCorrespondenceSequence = [
  clearModalAction,
  setCaseDetailPageTabAction('correspondence'),
  setCaseDetailPageTabFrozenAction,
  navigateToCaseDetailAction,
];

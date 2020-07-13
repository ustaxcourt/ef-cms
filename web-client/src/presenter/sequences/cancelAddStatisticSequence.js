import { navigateToCaseDetailCaseInformationAction } from '../actions/navigateToCaseDetailCaseInformationAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';

export const cancelAddStatisticSequence = [
  setCaseDetailPageTabFrozenAction,
  navigateToCaseDetailCaseInformationAction,
];

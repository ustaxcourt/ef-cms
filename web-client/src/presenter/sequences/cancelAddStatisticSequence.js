import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';

export const cancelAddStatisticSequence = [
  setCaseDetailPageTabFrozenAction,
  navigateToCaseDetailCaseInformationActionFactory(),
];

import { clearConfirmationTextAction } from '../actions/clearConfirmationTextAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';

export const cancelAddStatisticSequence = [
  clearConfirmationTextAction,
  navigateToCaseDetailCaseInformationActionFactory('statistics'),
];

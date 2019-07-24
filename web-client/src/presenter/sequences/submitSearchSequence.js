import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseIdFromSearchAction } from '../actions/setCaseIdFromSearchAction';

export const submitSearchSequence = [
  setCaseIdFromSearchAction,
  navigateToCaseDetailAction,
];

import { setCaseIdFromSearchAction } from '../actions/setCaseIdFromSearchAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';

export const submitSearchSequence = [
  setCaseIdFromSearchAction,
  navigateToCaseDetailAction,
];

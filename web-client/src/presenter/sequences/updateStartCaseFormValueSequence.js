import { updateFormValueWithoutEmptyStringAction } from '../actions/updateFormValueWithoutEmptyStringAction';
import { updatePartyTypeAction } from '../actions/StartCase/updatePartyTypeAction';

export const updateStartCaseFormValueSequence = [
  updateFormValueWithoutEmptyStringAction,
  updatePartyTypeAction,
];

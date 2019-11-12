import { setFormValueAction } from '../actions/setFormValueAction';
import { updatePartyTypeAction } from '../actions/StartCase/updatePartyTypeAction';

export const updateStartCaseFormValueSequence = [
  setFormValueAction,
  updatePartyTypeAction,
];

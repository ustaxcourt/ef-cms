import { clearModalAction } from '../actions/clearModalAction';
import { setCaseAction } from '../actions/setCaseAction';
import { updatePrimaryContactAction } from '../actions/updatePrimaryContactAction';

export const submitEditPrimaryContactSequence = [
  updatePrimaryContactAction,
  setCaseAction,
  clearModalAction,
];

import { clearModalAction } from '../actions/clearModalAction';
import { updatePrimaryContactAction } from '../actions/updatePrimaryContactAction';

export const submitEditPrimaryContactSequence = [
  updatePrimaryContactAction,
  clearModalAction,
];

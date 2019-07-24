import { clearCaseCaptionAction } from '../actions/clearCaseCaptionAction';
import { clearModalAction } from '../actions/clearModalAction';

export const dismissCaseCaptionModalSequence = [
  clearModalAction,
  clearCaseCaptionAction,
];

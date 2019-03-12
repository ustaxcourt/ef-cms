import { clearModalAction } from '../actions/clearModalAction';
import { clearCaseCaptionAction } from '../actions/clearCaseCaptionAction';

export const dismissCaseCaptionModalSequence = [
  clearModalAction,
  clearCaseCaptionAction,
];

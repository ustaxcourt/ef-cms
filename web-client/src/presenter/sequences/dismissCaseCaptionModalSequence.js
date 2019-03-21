import { clearModalAction } from '../actions/clearModalAction';
import { defaultCaseCaptionAction } from '../actions/defaultCaseCaptionAction';

export const dismissCaseCaptionModalSequence = [
  clearModalAction,
  defaultCaseCaptionAction,
];

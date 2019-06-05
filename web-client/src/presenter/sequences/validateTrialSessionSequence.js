import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const validateTrialSessionSequence = [
  validateTrialSessionAction,
  { error: [], success: [] },
];

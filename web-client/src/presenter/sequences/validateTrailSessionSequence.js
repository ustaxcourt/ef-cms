import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const validateTrailSessionSequence = [
  validateTrialSessionAction,
  { error: [], success: [] },
];

import { setReadOnlyModeAction } from '../actions/setReadOnlyModeAction';
import { setReadOnlyModeModalAction } from '../actions/setReadOnlyModeModalAction';

export const setReadOnlyModeSequence = [
  setReadOnlyModeModalAction,
  setReadOnlyModeAction,
];

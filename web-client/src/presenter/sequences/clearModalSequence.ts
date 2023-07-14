import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { sequence } from 'cerebral';

export const clearModalSequence = sequence([
  clearModalAction,
  clearModalStateAction,
]);

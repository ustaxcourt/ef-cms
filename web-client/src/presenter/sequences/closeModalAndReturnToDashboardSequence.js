import { clearModalAction } from '../actions/clearModalAction';
import { gotoDashboardSequence } from './gotoDashboardSequence';

export const closeModalAndReturnToDashboardSequence = [
  clearModalAction,
  gotoDashboardSequence,
];

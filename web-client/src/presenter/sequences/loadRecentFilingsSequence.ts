import { getRecentFilingsForUserAction } from '../actions/Dashboard/getRecentFilingsForUserAction';
import { setRecentFilingsAction } from '../actions/setRecentFilingsAction';

export const loadRecentFilingsSequence = [
  getRecentFilingsForUserAction,
  setRecentFilingsAction,
];

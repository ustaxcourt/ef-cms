import { getUsersInSelectedSectionAction } from '../actions/getUsersInSelectedSectionAction';
import { setUsersAction } from '../actions/setUsersAction';

export const getUsersInSectionSequence = [
  getUsersInSelectedSectionAction,
  setUsersAction,
];

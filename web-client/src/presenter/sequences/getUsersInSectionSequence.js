import { clearFormAssigneeIdAction } from '../actions/clearFormAssigneeIdAction';
import { getUsersInSelectedSectionAction } from '../actions/getUsersInSelectedSectionAction';
import { setUsersAction } from '../actions/setUsersAction';

export const getUsersInSectionSequence = [
  clearFormAssigneeIdAction,
  getUsersInSelectedSectionAction,
  setUsersAction,
];

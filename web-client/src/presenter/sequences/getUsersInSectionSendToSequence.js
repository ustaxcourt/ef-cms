import { getUsersInSelectedSectionAction } from '../actions/getUsersInSelectedSectionAction';
import { setUsersAction } from '../actions/setUsersAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const getUsersInSectionSequence = [
  set(state.form.assigneeId, ''),
  getUsersInSelectedSectionAction,
  setUsersAction,
];

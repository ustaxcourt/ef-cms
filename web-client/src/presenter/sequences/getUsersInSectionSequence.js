import { getUsersInSelectedSectionAction } from '../actions/getUsersInSelectedSectionAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setUsersAction } from '../actions/setUsersAction';

export const getUsersInSectionSequence = [
  set(state[props.form].assigneeId, ''),
  getUsersInSelectedSectionAction,
  setUsersAction,
];

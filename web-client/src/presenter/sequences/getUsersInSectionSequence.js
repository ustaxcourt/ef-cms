import { getUsersInSelectedSectionAction } from '../actions/getUsersInSelectedSectionAction';
import { setUsersAction } from '../actions/setUsersAction';
import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const getUsersInSectionSequence = [
  set(state[props.form].assigneeId, ''),
  getUsersInSelectedSectionAction,
  setUsersAction,
];

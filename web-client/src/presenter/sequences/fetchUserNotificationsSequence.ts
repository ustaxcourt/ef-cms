import { getNotificationsAction } from '../actions/getNotificationsAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';

export const fetchUserNotificationsSequence = [
  getNotificationsAction,
  setNotificationsAction,
];

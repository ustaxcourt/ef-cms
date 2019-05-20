import { getNotificationsAction } from '../actions/getNotificationsAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';

export const fetchUserNotificationsSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [getNotificationsAction, setNotificationsAction],
    unauthorized: [], // hakuna matata
  },
];

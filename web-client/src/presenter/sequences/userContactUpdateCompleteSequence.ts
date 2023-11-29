import { getUserContactEditCompleteAlertSuccessAction } from '../actions/getUserContactEditCompleteAlertSuccessAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setUserAction } from '@web-client/presenter/actions/setUserAction';
import { unsetUserContactEditProgressAction } from '../actions/unsetUserContactEditProgressAction';

export const userContactUpdateCompleteSequence = [
  setUserAction,
  unsetUserContactEditProgressAction,
  getUserContactEditCompleteAlertSuccessAction,
  setAlertSuccessAction,
];

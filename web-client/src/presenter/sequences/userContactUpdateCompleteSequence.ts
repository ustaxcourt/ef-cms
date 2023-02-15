import { getUserContactEditCompleteAlertSuccessAction } from '../actions/getUserContactEditCompleteAlertSuccessAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { unsetUserContactEditProgressAction } from '../actions/unsetUserContactEditProgressAction';

export const userContactUpdateCompleteSequence = [
  unsetUserContactEditProgressAction,
  getUserContactEditCompleteAlertSuccessAction,
  setAlertSuccessAction,
];

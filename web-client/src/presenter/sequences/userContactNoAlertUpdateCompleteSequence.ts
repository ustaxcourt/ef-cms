import { setUserAction } from '@web-client/presenter/actions/setUserAction';
import { unsetUserContactEditProgressAction } from '../actions/unsetUserContactEditProgressAction';

export const userContactNoAlertUpdateCompleteSequence = [
  setUserAction,
  unsetUserContactEditProgressAction,
];

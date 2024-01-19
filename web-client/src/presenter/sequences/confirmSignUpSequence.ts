import { confirmSignUpAction } from '../actions/confirmSignUpAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';

// TODO 10007: Move to /Login
export const confirmSignUpSequence = [
  confirmSignUpAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction],
  },
  navigateToLoginSequence,
] as unknown as (props: { confirmationCode: string; userId: string }) => {};

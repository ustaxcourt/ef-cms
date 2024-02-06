import { clearUserAction } from '../actions/clearUserAction';
import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { verifyUserPendingEmailAction } from '../actions/verifyUserPendingEmailAction';

export const gotoVerifyEmailSequence = [
  verifyUserPendingEmailAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction],
  },
  clearUserAction,
  navigateToLoginAction,
] as unknown as (props: { token: string }) => void;

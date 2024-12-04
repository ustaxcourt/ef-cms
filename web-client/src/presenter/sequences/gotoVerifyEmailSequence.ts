import { clearUserAction } from '../actions/clearUserAction';
import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertInfoAction } from '@web-client/presenter/actions/setAlertInfoAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setInitialVerifyAlertMessageAction } from '@web-client/presenter/actions/setInitialVerifyAlertMessageAction';
import { verifyUserPendingEmailAction } from '../actions/verifyUserPendingEmailAction';

export const gotoVerifyEmailSequence = [
  setInitialVerifyAlertMessageAction,
  setAlertInfoAction,
  navigateToLoginAction,
  verifyUserPendingEmailAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction],
  },
  clearUserAction,
] as unknown as (props: { token: string }) => void;

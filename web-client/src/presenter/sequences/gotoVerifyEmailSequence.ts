import { clearUserAction } from '../actions/clearUserAction';
import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';
import { refreshTokenAction } from '@web-client/presenter/actions/Login/refreshTokenAction';
import { setAlertInfoAction } from '@web-client/presenter/actions/setAlertInfoAction';
import { setNotLoggedInVerificationAction } from '@web-client/presenter/actions/setNotLoggedInVerificationAction';
import { startWebSocketConnectionSequenceDecorator } from '@web-client/presenter/utilities/startWebSocketConnectionSequenceDecorator';
import { verifyUserPendingEmailAction } from '../actions/verifyUserPendingEmailAction';

export const gotoVerifyEmailSequence =
  startWebSocketConnectionSequenceDecorator([
    refreshTokenAction,
    {
      userIsLoggedIn: [verifyUserPendingEmailAction, setAlertInfoAction],
      userIsNotLoggedIn: [setNotLoggedInVerificationAction],
    },
    clearUserAction,
    navigateToLoginAction,
  ]) as unknown as (props: { token: string }) => void;

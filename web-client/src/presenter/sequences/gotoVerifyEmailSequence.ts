import { clearUserAction } from '../actions/clearUserAction';
import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';
import { setAlertInfoAction } from '@web-client/presenter/actions/setAlertInfoAction';
import { startWebSocketConnectionSequenceDecorator } from '@web-client/presenter/utilities/startWebSocketConnectionSequenceDecorator';
import { verifyUserPendingEmailAction } from '../actions/verifyUserPendingEmailAction';

export const gotoVerifyEmailSequence =
  startWebSocketConnectionSequenceDecorator([
    verifyUserPendingEmailAction,
    setAlertInfoAction,
    clearUserAction,
    navigateToLoginAction,
  ]) as unknown as (props: { token: string }) => void;

import { clearUserAction } from '../actions/clearUserAction';
import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { verifyUserPendingEmailAction } from '../actions/verifyUserPendingEmailAction';

export const gotoVerifyEmailSequence = [
  startWebSocketConnectionSequenceDecorator([
    verifyUserPendingEmailAction,
    setAlertSuccessAction,
    clearUserAction,
    navigateToLoginAction,
  ]),
] as unknown as (props: { token: string }) => void;

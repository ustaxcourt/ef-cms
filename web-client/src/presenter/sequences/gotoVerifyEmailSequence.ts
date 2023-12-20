import { clearUserAction } from '../actions/clearUserAction';
import { navigateToPublicEmailVerificationSuccessAction } from '../actions/Public/navigateToPublicEmailVerificationSuccessAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { verifyUserPendingEmailAction } from '../actions/verifyUserPendingEmailAction';

export const gotoVerifyEmailSequence = [
  startWebSocketConnectionSequenceDecorator([
    verifyUserPendingEmailAction,
    clearUserAction,
    navigateToPublicEmailVerificationSuccessAction,
  ]),
];

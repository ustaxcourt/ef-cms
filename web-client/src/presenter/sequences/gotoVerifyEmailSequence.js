import { clearUserAction } from '../actions/clearUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToPublicEmailVerificationInstructionsAction } from '../actions/Public/navigateToPublicEmailVerificationInstructionsAction';
import { navigateToPublicEmailVerificationSuccessAction } from '../actions/Public/navigateToPublicEmailVerificationSuccessAction';
import { verifyUserPendingEmailAction } from '../actions/verifyUserPendingEmailAction';

export const gotoVerifyEmailSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      verifyUserPendingEmailAction,
      clearUserAction,
      navigateToPublicEmailVerificationSuccessAction,
    ],
    unauthorized: [navigateToPublicEmailVerificationInstructionsAction],
  },
];

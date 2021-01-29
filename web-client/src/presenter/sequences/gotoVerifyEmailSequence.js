import { clearUserAction } from '../actions/clearUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToPublicEmailVerificationSuccessAction } from '../actions/Public/navigateToPublicEmailVerificationSuccessAction';
import { navigateToPublicVerifyEmailInstructionsAction } from '../actions/Public/navigateToPublicVerifyEmailInstructionsAction';

export const gotoVerifyEmailSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      // verifyUserAction, // TODO
      clearUserAction,
      navigateToPublicEmailVerificationSuccessAction,
    ],
    unauthorized: [navigateToPublicVerifyEmailInstructionsAction],
  },
];

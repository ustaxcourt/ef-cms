import { clearUserAction } from '../actions/clearUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToPublicEmailVerificationInstructionsAction } from '../actions/Public/navigateToPublicEmailVerificationInstructionsAction';
import { navigateToPublicEmailVerificationSuccessAction } from '../actions/Public/navigateToPublicEmailVerificationSuccessAction';

export const gotoVerifyEmailSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      // verifyUserAction, // TODO in separate task on story 7406
      clearUserAction,
      navigateToPublicEmailVerificationSuccessAction,
    ],
    unauthorized: [navigateToPublicEmailVerificationInstructionsAction],
  },
];

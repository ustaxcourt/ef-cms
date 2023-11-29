import { cognitoResendVerificationLinkAction } from '@web-client/presenter/actions/Public/resendVerificationLinkAction';
import { navigateToVerificationSentAction } from '@web-client/presenter/actions/navigateToVerificationSentAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';

export const cognitoResendVerificationLinkSequence = [
  cognitoResendVerificationLinkAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction, navigateToVerificationSentAction],
  },
];

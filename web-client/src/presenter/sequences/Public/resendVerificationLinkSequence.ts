import { navigateToVerificationSentAction } from '@web-client/presenter/actions/navigateToVerificationSentAction';
import { resendVerificationLinkAction } from '@web-client/presenter/actions/Public/resendVerificationLinkAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';

export const resendVerificationLinkSequence = [
  resendVerificationLinkAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction, navigateToVerificationSentAction],
  },
];

import { confirmSignUpAction } from '@web-client/presenter/actions/confirmSignUpAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';

export const confirmSignUpSequence = [
  confirmSignUpAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction],
  },
  navigateToLoginSequence,
] as unknown as (props: { confirmationCode: string; userId: string }) => {};

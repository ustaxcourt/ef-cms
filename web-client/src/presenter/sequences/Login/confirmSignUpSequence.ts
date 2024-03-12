import { confirmSignUpAction } from '@web-client/presenter/actions/confirmSignUpAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setWaitingForResponseAction } from '@web-client/presenter/actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const confirmSignUpSequence = [
  setWaitingForResponseAction,
  confirmSignUpAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction],
  },
  navigateToLoginSequence,
  unsetWaitingForResponseAction,
] as unknown as (props: { confirmationCode: string; userId: string }) => {};

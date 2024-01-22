import { clearAuthStateAction } from '@web-client/presenter/actions/Login/clearAuthStateAction';
import { createForgotPasswordLinkAction } from '@web-client/presenter/actions/Login/createForgotPasswordLinkAction';
import { forgotPasswordAction } from '@web-client/presenter/actions/Login/forgotPasswordAction';
import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '@web-client/presenter/actions/setSaveAlertsForNavigationAction';

export const submitForgotPasswordSequence = [
  forgotPasswordAction,
  {
    success: [
      createForgotPasswordLinkAction,
      setAlertSuccessAction,
      clearAuthStateAction,
    ],
    unconfirmedAccount: [
      setAlertErrorAction,
      setSaveAlertsForNavigationAction,
      navigateToLoginAction,
    ],
  },
] as unknown as () => {};

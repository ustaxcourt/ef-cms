import { clearAuthStateAction } from '@web-client/presenter/actions/Login/clearAuthStateAction';
import { createForgotPasswordLinkAction } from '@web-client/presenter/actions/Login/createForgotPasswordLinkAction';
import { forgotPasswordAction } from '@web-client/presenter/actions/Login/forgotPasswordAction';
import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setAlertWarningAction } from '@web-client/presenter/actions/setAlertWarningAction';
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
      setAlertWarningAction,
      setSaveAlertsForNavigationAction,
      navigateToLoginAction,
    ],
  },
] as unknown as () => {};

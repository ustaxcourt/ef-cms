import { clearAuthStateAction } from '@web-client/presenter/actions/Login/clearAuthStateAction';
import { createForgotPasswordLinkAction } from '@web-client/presenter/actions/Login/createForgotPasswordLinkAction';
import { forgotPasswordAction } from '@web-client/presenter/actions/Login/forgotPasswordAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';

export const submitForgotPasswordSequence = [
  forgotPasswordAction,
  createForgotPasswordLinkAction,
  setAlertSuccessAction,
  clearAuthStateAction,
] as unknown as () => {};

import { setResetPasswordAction } from '@web-client/presenter/actions/Login/setResetPasswordAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';

export const resetPasswordSequence = [
  setResetPasswordAction,
  setupCurrentPageAction('ChangePassword'),
] as unknown as () => void;

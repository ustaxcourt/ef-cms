import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { clearAuthStateAction } from '@web-client/presenter/actions/Login/clearAuthStateAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const goToForgotPasswordSequence = [
  clearAuthStateAction,
  clearAlertsAction,
  setupCurrentPageAction('ForgotPassword'),
] as unknown as () => void;

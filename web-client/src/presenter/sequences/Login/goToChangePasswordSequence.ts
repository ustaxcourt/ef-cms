import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { clearAuthStateAction } from '@web-client/presenter/actions/Login/clearAuthStateAction';
import { setupChangePasswordAction } from '@web-client/presenter/actions/setupChangePasswordAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const goToChangePasswordSequence = [
  clearAuthStateAction,
  clearAlertsAction,
  setupChangePasswordAction,
  setupCurrentPageAction('ChangePassword'),
] as unknown as (props: { email: string; tempPassword: string }) => void;

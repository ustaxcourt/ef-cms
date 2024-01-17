import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { setupChangePasswordFormAction } from '@web-client/presenter/actions/setupChangePasswordFormAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const goToChangePasswordSequence = [
  clearFormAction,
  clearAlertsAction,
  setupChangePasswordFormAction,
  setupCurrentPageAction('ChangePassword'),
] as unknown as () => void;

import { setupChangePasswordFormAction } from '@web-client/presenter/actions/setupChangePasswordFormAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const goToChangePasswordSequence = [
  setupChangePasswordFormAction,
  setupCurrentPageAction('ChangePassword'),
] as unknown as () => void;

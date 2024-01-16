import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const goToChangePasswordSequence = [
  setupCurrentPageAction('ChangePassword'),
] as unknown as () => void;

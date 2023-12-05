import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const goToLoginSequence = [
  setupCurrentPageAction('Login'),
] as unknown as () => void;

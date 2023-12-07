import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const gotoLoginSequence = [
  setupCurrentPageAction('Login'),
] as unknown as () => void;

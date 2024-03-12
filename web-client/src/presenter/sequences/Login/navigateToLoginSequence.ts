import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';

export const navigateToLoginSequence = [
  navigateToLoginAction,
] as unknown as () => void;

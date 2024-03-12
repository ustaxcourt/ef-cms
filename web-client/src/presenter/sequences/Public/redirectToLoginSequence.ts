import { redirectToLoginAction } from '@web-client/presenter/actions/Public/redirectToLoginAction';

export const redirectToLoginSequence = [
  redirectToLoginAction,
] as unknown as () => void;

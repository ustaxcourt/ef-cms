import { getUserAction } from '@web-client/presenter/actions/getUserAction';
import { refreshTokenAction } from '@web-client/presenter/actions/Login/refreshTokenAction';
import { setTokenAction } from '@web-client/presenter/actions/Login/setTokenAction';
import { setUserAction } from '@web-client/presenter/actions/setUserAction';

export const refreshTokenSequence = [
  refreshTokenAction,
  setTokenAction,
  getUserAction, // TODO 10007: this seems odd
  setUserAction,
] as unknown as () => void;

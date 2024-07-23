import { handleIdleLogoutAction } from '@web-client/presenter/actions/handleIdleLogoutAction';
import { signOutIdleSequence } from '@web-client/presenter/sequences/signOutIdleSequence';

export const handleIdleLogoutSequence = [
  handleIdleLogoutAction,
  {
    continue: [],
    logout: signOutIdleSequence,
  },
];

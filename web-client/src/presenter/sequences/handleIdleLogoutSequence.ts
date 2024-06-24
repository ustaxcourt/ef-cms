import { gotoIdleLogoutSequence } from '@web-client/presenter/sequences/gotoIdleLogoutSequence';
import { handleIdleLogoutAction } from '@web-client/presenter/actions/handleIdleLogoutAction';

export const handleIdleLogoutSequence = [
  handleIdleLogoutAction,
  {
    continue: [],
    logout: gotoIdleLogoutSequence,
  },
];

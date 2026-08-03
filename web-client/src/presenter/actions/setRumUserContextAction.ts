import { setRumUserContext } from '@web-client/providers/realUserMonitoring';
import { state } from '@web-client/presenter/app.cerebral';

export const setRumUserContextAction = ({ get }: ActionProps): void => {
  const user = get(state.user);
  if (!user) return;
  setRumUserContext({
    role: user.role,
    section: user.section,
    userId: user.userId,
  });
};

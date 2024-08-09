import { state } from '@web-client/presenter/app.cerebral';

export const checkDawsonHasUpdatedAction = ({ get, path }: ActionProps) => {
  return get(state.dawsonHasUpdated)
    ? path.dawsonHasUpdated()
    : path.dawsonHasNotUpdated();
};

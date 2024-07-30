import { state } from '@web-client/presenter/app.cerebral';

export const isLoggedInAction = ({ get, path }: ActionProps) => {
  if (get(state.token)) {
    return path.yes();
  }
  return path.no();
};

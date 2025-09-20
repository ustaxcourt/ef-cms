import { state } from '@web-client/presenter/app.cerebral';

export const haveNOTTsBeenServedAction = ({ get, path }: ActionProps) => {
  const { hasNottBeenServed } = get(state.trialSession);

  if (hasNottBeenServed) {
    return path.yes();
  } else {
    return path.no();
  }
};

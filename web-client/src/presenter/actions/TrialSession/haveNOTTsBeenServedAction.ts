import { state } from '@web-client/presenter/app.cerebral';

export const haveNOTTsBeenServedAction = ({ get, path }: ActionProps) => {
  const { hasNOTTBeenServed } = get(state.trialSession);

  if (hasNOTTBeenServed) {
    return path.yes();
  } else {
    return path.no();
  }
};

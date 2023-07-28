import { state } from '@web-client/presenter/app.cerebral';

export const setNottServiceCompleteAction = ({ store }: ActionProps) => {
  store.set(state.trialSession.hasNOTTBeenServed, true);
};

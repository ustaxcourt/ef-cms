import { state } from '@web-client/presenter/app.cerebral';

export const setDismissedAlertForNottAction = ({ store }: ActionProps) => {
  store.set(state.trialSession.dismissedAlertForNott, true);
};

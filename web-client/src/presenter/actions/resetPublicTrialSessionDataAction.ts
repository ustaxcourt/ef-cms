import { state } from '@web-client/presenter/app-public.cerebral';

export const resetPublicTrialSessionDataAction = ({ store }: ActionProps) => {
  store.set(state.publicTrialSessionData, {});
};

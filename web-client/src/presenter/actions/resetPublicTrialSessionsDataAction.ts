import { PUBLIC_TRIAL_SESSIONS_DATA_KEY } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app-public.cerebral';

export const resetPublicTrialSessionsDataAction = ({ store }: ActionProps) => {
  store.set(state[PUBLIC_TRIAL_SESSIONS_DATA_KEY], {});
};

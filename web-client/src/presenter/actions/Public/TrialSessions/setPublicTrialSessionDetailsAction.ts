import type { RawPublicTrialSessionDetails } from '@shared/business/entities/trialSessions/PublicTrialSessionDetails';
import { state } from '@web-client/presenter/app-public.cerebral';

export const setPublicTrialSessionDetailsAction = ({
  props,
  store,
}: ActionProps<{ trialSession: RawPublicTrialSessionDetails }>) => {
  store.set(state.trialSessionDetailsPage.trialSession, props.trialSession);
};

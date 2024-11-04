import { PublicTrialSessionDetails } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';
import { state } from '@web-client/presenter/app-public.cerebral';

export const setPublicTrialSessionDetailsAction = ({
  props,
  store,
}: ActionProps<{ trialSession: PublicTrialSessionDetails }>) => {
  store.set(state.trialSessionDetailsPage.trialSession, props.trialSession);
};

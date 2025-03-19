import { state } from '@web-client/presenter/app.cerebral';

export const setPropsForTrialLocationAction = ({
  props,
  store,
}: ActionProps) => {
  const { trialLocation } = props;
  const filterStatusForTrialLocation = true;

  store.set(state.trialLocationPage.location, trialLocation);
  return { filterStatusForTrialLocation };
};

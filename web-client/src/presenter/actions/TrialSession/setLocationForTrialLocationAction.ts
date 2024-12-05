import { state } from '@web-client/presenter/app.cerebral';

export const setLocationForTrialLocationAction = ({
  props,
  store,
}: ActionProps) => {
  const { trialLocation } = props;

  store.set(state.trialLocationPage.location, trialLocation);
};

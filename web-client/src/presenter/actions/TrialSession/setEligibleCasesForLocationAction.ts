import { state } from '@web-client/presenter/app.cerebral';

export const setEligibleCasesForLocationAction = ({
  props,
  store,
}: ActionProps) => {
  const { eligibleCases } = props;

  store.set(state.trialLocationPage.eligibleCases, eligibleCases);
};

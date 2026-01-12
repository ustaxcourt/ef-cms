import { state } from '@web-client/presenter/app.cerebral';

export const getFormattedTrialLocationAction = ({ get }: ActionProps) => {
  let trialLocation = get(state.blockedCaseReportFilter.trialLocationFilter);
  if (!trialLocation) {
    trialLocation = get(state.trialLocationPage.location);
  }

  return { trialLocation };
};

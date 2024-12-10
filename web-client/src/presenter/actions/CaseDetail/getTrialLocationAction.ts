import { state } from '@web-client/presenter/app.cerebral';

export const getTrialLocationAction = async ({ get, path }: ActionProps) => {
  let trialLocation;
  if (get(state.currentPage) === 'TrialLocation') {
    trialLocation = get(state.trialLocationPage.location);
    return path.trialLocation({ trialLocation });
  } else {
    trialLocation = get(state.blockedCaseReportFilter.trialLocationFilter);
    return path.blockedCasesReport({ trialLocation });
  }
};

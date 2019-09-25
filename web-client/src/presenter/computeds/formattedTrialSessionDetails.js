export const formattedTrialSessionDetails = (get, applicationContext) => {
  return applicationContext
    .getUtilities()
    .formattedTrialSessionDetails({ applicationContext });
};

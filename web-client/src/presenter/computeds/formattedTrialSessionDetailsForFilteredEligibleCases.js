import { formattedTrialSessionDetails } from './formattedTrialSessionDetails';
import { state } from 'cerebral';

export const formattedTrialSessionDetailsForFilteredEligibleCases = (
  get,
  applicationContext,
) => {
  const trialSessionDetails = formattedTrialSessionDetails(
    get,
    applicationContext,
  );
  const filter = get(
    state.screenMetadata.eligibleCasesFilter.hybridSessionFilter,
  );

  trialSessionDetails.formattedEligibleCases =
    trialSessionDetails.formattedEligibleCases.filter(eligibleCase => {
      const allSmallCases = /^(S+)/;
      const regularCasesOnly = /^(?!S+)/;

      if (filter === 'Small') {
        return allSmallCases.test(eligibleCase.docketNumberSuffix);
      } else if (filter === 'Regular') {
        return regularCasesOnly.test(eligibleCase.docketNumberSuffix);
      } else {
        return true;
      }
    });

  return trialSessionDetails;
};

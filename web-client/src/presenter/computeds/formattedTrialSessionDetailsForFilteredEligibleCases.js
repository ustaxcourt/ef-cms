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
      if (!filter) return true;
      if (filter === 'Small') {
        return eligibleCase.docketNumberSuffix === 'S';
      }
      if (filter === 'Regular') {
        return eligibleCase.docketNumberSuffix !== 'S';
      }
    });

  return trialSessionDetails;
};

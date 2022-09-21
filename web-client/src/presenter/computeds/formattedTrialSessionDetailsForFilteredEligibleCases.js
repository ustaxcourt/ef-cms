import { DOCKET_NUMBER_SUFFIXES } from '../../../../shared/src/business/entities/EntityConstants';
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
      if (filter === 'Small') {
        return (
          eligibleCase.docketNumberSuffix === DOCKET_NUMBER_SUFFIXES.SMALL ||
          eligibleCase.docketNumberSuffix ===
            DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY
        );
      } else if (filter === 'Regular') {
        return (
          eligibleCase.docketNumberSuffix === null ||
          (eligibleCase.docketNumberSuffix !== DOCKET_NUMBER_SUFFIXES.SMALL &&
            eligibleCase.docketNumberSuffix !==
              DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY)
        );
      } else {
        return true;
      }
    });

  return trialSessionDetails;
};

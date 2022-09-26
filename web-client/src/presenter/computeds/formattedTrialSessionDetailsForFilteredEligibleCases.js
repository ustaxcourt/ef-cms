import { DOCKET_NUMBER_SUFFIXES } from '../../../../shared/src/business/entities/EntityConstants';
import { formattedEligibleCasesHelper } from './formattedEligibleCasesHelper';
import { state } from 'cerebral';

export const formattedTrialSessionDetailsForFilteredEligibleCases = (
  get,
  applicationContext,
) => {
  const formattedEligibleCases = formattedEligibleCasesHelper(
    get,
    applicationContext,
  );
  console.log('formattedEligibleCases', formattedEligibleCases);
  const filter = get(
    state.screenMetadata.eligibleCasesFilter.hybridSessionFilter,
  );

  const filteredEligibleCases = formattedEligibleCases.filter(eligibleCase => {
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

  console.log('filteredEligibleCases', filteredEligibleCases);

  return filteredEligibleCases;
};

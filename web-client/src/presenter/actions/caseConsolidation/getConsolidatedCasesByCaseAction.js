import { state } from 'cerebral';

/**
 * Fetches the cases with the given lead docket number.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCasesByUser use case
 * @param {object} providers.get the cerebral props object
 * @returns {object} contains the caseList returned from the getCasesByUser use case
 */
export const getConsolidatedCasesByCaseAction = async ({
  applicationContext,
  get,
}) => {
  const leadDocketNumber = get(state.caseDetail.leadDocketNumber);
  let consolidatedCases = [];

  if (leadDocketNumber) {
    const unsortedConsolidatedCases = await applicationContext
      .getUseCases()
      .getConsolidatedCasesByCaseInteractor(applicationContext, {
        docketNumber: leadDocketNumber,
      });

    consolidatedCases = unsortedConsolidatedCases.sort(
      applicationContext.getUtilities().compareCasesByDocketNumber,
    );
  }

  return { consolidatedCases };
};

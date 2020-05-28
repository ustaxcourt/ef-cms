import { state } from 'cerebral';

/**
 * Fetches the cases with the given lead case id.
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
  const { leadCaseId } = get(state.caseDetail);
  let consolidatedCases = [];

  if (leadCaseId) {
    const unsortedConsolidatedCases = await applicationContext
      .getUseCases()
      .getConsolidatedCasesByCaseInteractor({
        applicationContext,
        caseId: leadCaseId,
      });

    consolidatedCases = unsortedConsolidatedCases.sort(
      applicationContext.getUtilities().compareCasesByDocketNumber,
    );
  }

  return { consolidatedCases };
};

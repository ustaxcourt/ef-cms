import { orderBy } from 'lodash';
import { state } from 'cerebral';

/**
 * Fetches the cases with the given lead case id.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCasesByUser use case
 * @param {object} providers.get the cerebral props object
 * @param {object} providers.store the cerebral store used for setting the state.cases
 * @returns {object} contains the caseList returned from the getCasesByUser use case
 */
export const getConsolidatedCasesByCaseAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const { leadCaseId } = get(state.caseDetail);

  if (leadCaseId) {
    let consolidatedCases = await applicationContext
      .getUseCases()
      .getConsolidatedCasesByCaseInteractor({
        applicationContext,
        caseId: leadCaseId,
      });

    consolidatedCases = orderBy(consolidatedCases, 'createdAt', 'asc');

    store.set(state.caseDetail.consolidatedCases, consolidatedCases);
  }
};

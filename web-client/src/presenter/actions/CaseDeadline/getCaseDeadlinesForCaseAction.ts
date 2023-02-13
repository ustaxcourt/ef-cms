import { state } from 'cerebral';

/**
 * gets and sets the case deadlines for a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.store the cerebral store object
 */
export const getCaseDeadlinesForCaseAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  const caseDeadlines = await applicationContext
    .getUseCases()
    .getCaseDeadlinesForCaseInteractor(applicationContext, {
      docketNumber,
    });

  store.set(state.caseDeadlines, caseDeadlines);
};

import { state } from 'cerebral';

/**
 * Generates a coversheet for the docket entry set on state
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 */
export const generateCoversheetAction = async ({ applicationContext, get }) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const docketEntryId = get(state.docketEntryId);

  await applicationContext
    .getUseCases()
    .addCoversheetInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });
};

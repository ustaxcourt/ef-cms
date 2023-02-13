import { state } from 'cerebral';

/**
 * call to remove consolidate cases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const removeConsolidatedCasesAction = async ({
  applicationContext,
  get,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const casesToRemove = get(state.modal.casesToRemove);
  const docketNumbersToRemove = Object.entries(casesToRemove)
    .filter(([, shouldRemove]) => shouldRemove)
    .map(([docketNumberToRemove]) => docketNumberToRemove);

  await applicationContext
    .getUseCases()
    .removeConsolidatedCasesInteractor(applicationContext, {
      docketNumber,
      docketNumbersToRemove,
    });

  return {
    alertSuccess: {
      message: 'Selected cases unconsolidated.',
    },
  };
};

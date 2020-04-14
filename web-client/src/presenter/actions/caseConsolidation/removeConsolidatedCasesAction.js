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
  const caseId = get(state.caseDetail.caseId);
  const casesToRemove = get(state.modal.casesToRemove);
  const caseIdsToRemove = Object.entries(casesToRemove)
    .filter(([, shouldRemove]) => shouldRemove)
    .map(([caseIdToRemove]) => caseIdToRemove);

  await applicationContext.getUseCases().removeConsolidatedCasesInteractor({
    applicationContext,
    caseId,
    caseIdsToRemove,
  });

  return {
    alertSuccess: {
      message: 'Selected cases unconsolidated.',
    },
  };
};

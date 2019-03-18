/**
 * takes the state.caseDetail and updates it via the updateCase use case.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context needed for getting the updateCase use case
 * @param {Object} providers.get the cerebral store used for getting state.caseDetail
 * @param {Object} providers.props the cerebral store used for getting props.combinedCaseDetailWithForm
 * @returns {Object} the alertSuccess and the caseDetail
 */
export const runBatchProcessAction = async ({ applicationContext }) => {
  await applicationContext.getUseCases().runBatchProcess({
    applicationContext,
  });
};

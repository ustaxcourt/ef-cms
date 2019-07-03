/**
 *  Gets a list of the types of cases, such as Deficiency, Innocent Spouse, etc
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCaseTypes use case
 * @param {Function} providers.get the cerebral get function used for getting state.user.userId
 * @returns {object} contains the caseTypes array returned from the getCaseTypes use case
 */
export const getCaseTypesAction = async ({ applicationContext }) => {
  const caseTypes = await applicationContext
    .getUseCases()
    .getCaseTypesInteractor({
      applicationContext,
    });
  return { caseTypes };
};

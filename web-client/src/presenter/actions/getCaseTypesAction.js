/**
 *  Gets a list of the types of cases, such as Deficiency, Innocent Spouse, etc
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext needed for getting the getCaseTypes use case
 * @param {Function} providers.get the cerebral get function used for getting state.user.userId
 * @returns {Array} contains the caseTypes array returned from the getCaseTypes use case
 */
export const getCaseTypes = async ({ applicationContext }) => {
  const caseTypes = await applicationContext.getUseCases().getCaseTypes({
    applicationContext,
  });
  return { caseTypes };
};

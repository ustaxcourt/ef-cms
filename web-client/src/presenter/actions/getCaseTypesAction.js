/**
 *  Gets a list of the types of cases, such as Deficiency, Innocent Spouse, etc
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext needed for getting the getCaseTypes use case
 * @param {Function} providers.get the cerebral get function used for getting state.user.userId
 * @returns {Object} contains the caseTypes array returned from the getCaseTypes use case
 */
export default async ({ applicationContext }) => {
  const caseTypes = await applicationContext.getUseCases().getCaseTypes({
    applicationContext,
  });
  return { caseTypes };
};

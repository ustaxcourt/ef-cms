/**
 * Fetches the case usign the getCase use case using the props.docketNumber
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.user.token
 * @param {Object} providers.applicationContext needed for getting the getCase use case
 * @param {Object} providers.props the cerebral props object containing props.docketNumber
 * @returns {Object} contains the caseDetail returned from the use case
 */
export const getCaseAction = async ({ applicationContext, props }) => {
  const caseDetail = await applicationContext.getUseCases().getCase({
    applicationContext,
    docketNumber: props.docketNumber,
  });

  return { caseDetail };
};

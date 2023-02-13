/**
 * fetch the public case detail
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {object} providers.props the cerebral props object containing props.docketNumber
 * @returns {object} contains the caseDetail returned from the use case
 */
export const getPublicCaseAction = async ({ applicationContext, props }) => {
  const caseDetail = await applicationContext
    .getUseCases()
    .getCaseInteractor(applicationContext, {
      docketNumber: props.docketNumber,
    });

  return {
    caseDetail,
  };
};

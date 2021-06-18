import { state } from 'cerebral';
/**
 * Fetches the case using the getCase use case using the props.docketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object containing props.docketNumber
 * @returns {object} contains the caseDetail returned from the use case
 */
export const getCaseAction = async ({ applicationContext, get, props }) => {
  const docketNumber = props.docketNumber || get(state.caseDetail.docketNumber);
  const caseDetail = await applicationContext
    .getUseCases()
    .getCaseInteractor(applicationContext, {
      docketNumber,
    });

  return { caseDetail };
};

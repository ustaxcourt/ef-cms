import { state } from 'cerebral';

/**
 * calls proxy endpoint to serve a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based upon if there was any paper service or all electronic service
 */
export const serveCaseToIrsAction = async ({
  applicationContext,
  get,
  path,
  props,
}) => {
  const caseId = props.caseId || get(state.caseDetail.caseId);

  const pdfUrl = await applicationContext
    .getUseCases()
    .serveCaseToIrsInteractor({
      applicationContext,
      caseId,
    });

  if (pdfUrl) {
    return path.paper({ pdfUrl });
  }

  return path.electronic();
};

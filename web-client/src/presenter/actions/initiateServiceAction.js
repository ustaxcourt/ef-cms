import { state } from 'cerebral';

/**
 * initiates the document to be served
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.props the cerebral props object used for getting the props.user
 * @returns {object} the user
 */
export const initiateServiceAction = async ({ applicationContext, get }) => {
  const documentId = get(state.documentId);
  const caseId = get(state.caseDetail.caseId);

  await applicationContext.getUseCases().initiateCourtIssuedServiceInteractor({
    applicationContext,
    caseId,
    documentId,
  });
};

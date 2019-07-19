import { state } from 'cerebral';

/**
 * serves the current document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store used for setting the state.alertError
 * @returns the path to take
 */
export const serveDocumentAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const documentId = get(state.documentId);
  const caseId = get(state.caseDetail.caseId);

  const caseDetail = await applicationContext
    .getUseCases()
    .serveSignedStipDecisionInteractor({
      applicationContext,
      caseId,
      documentId,
    });

  store.set(state.caseDetail, caseDetail);

  return {
    alertSuccess: {
      title: 'Service has been initiated.',
    },
  };
};

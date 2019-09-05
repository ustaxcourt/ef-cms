import { state } from 'cerebral';
/**
 * Gets the JWT token and refresh token using the cognito authorization code.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext contains the assignWorkItems method we will need from the getUseCases method
 * @param {object} providers.props props passed through via cerebral
 * @returns {Promise} async action
 */
export const archiveDraftDocumentAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const { caseId, documentId, documentTitle } = get(state.archiveDraftDocument);

  await applicationContext
    .getUseCases()
    .archiveDraftDocumentInteractor({ applicationContext, caseId, documentId });

  store.set(state.alertSuccess, {
    message: documentTitle,
    title: 'This document has been deleted:',
  });
};

import { get } from 'cerebral/factories';
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
  props,
}) => {
  const { documentId } = props;
  const caseId = get(state.caseDetail.caseId);

  await applicationContext
    .getUseCases()
    .archiveDraftDocumentInteractor({ applicationContext, caseId, documentId });
};

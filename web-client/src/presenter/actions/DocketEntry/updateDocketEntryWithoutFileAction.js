import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * submit a new docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const updateDocketEntryWithoutFileAction = async ({
  applicationContext,
  get,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const documentId = get(state.documentId);

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile'],
  );

  documentMetadata = {
    ...documentMetadata,
    caseId,
    createdAt: documentMetadata.dateReceived,
    docketNumber,
    isFileAttached: false,
    isPaper: true,
    receivedAt: documentMetadata.dateReceived,
  };

  const caseDetail = await applicationContext
    .getUseCases()
    .updateDocketEntryInteractor({
      applicationContext,
      documentMetadata,
      primaryDocumentFileId: documentId,
    });

  return {
    caseDetail,
    caseId,
    docketNumber,
  };
};

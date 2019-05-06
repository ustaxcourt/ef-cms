import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * submit a new docket entry
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Object} providers.props the cerebral props object
 */
export const submitDocketEntryAction = async ({
  get,
  props,
  applicationContext,
}) => {
  const { docketNumber, caseId } = get(state.caseDetail);
  const { primaryDocumentFileId, secondaryDocumentFileId } = props;

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile', 'secondaryDocumentFile'],
  );

  documentMetadata = {
    ...documentMetadata,
    docketNumber,
    caseId,
    createdAt: documentMetadata.dateReceived,
  };

  const caseDetail = await applicationContext
    .getUseCases()
    .fileExternalDocument({
      applicationContext,
      documentMetadata,
      primaryDocumentFileId,
      secondaryDocumentFileId,
    });

  for (let document of caseDetail.documents) {
    if (document.processingStatus === 'pending') {
      await applicationContext.getUseCases().createCoverSheet({
        applicationContext,
        caseId: caseDetail.caseId,
        documentId: document.documentId,
      });
    }
  }

  return {
    caseDetail,
    caseId: docketNumber,
  };
};

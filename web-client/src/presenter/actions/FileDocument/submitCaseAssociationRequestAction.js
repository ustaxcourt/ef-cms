import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * set practitioner to a case
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Object} providers.props the cerebral props object
 */
export const submitCaseAssociationRequestAction = async ({
  get,
  props,
  applicationContext,
}) => {
  const { docketNumber, caseId } = get(state.caseDetail);
  const { primaryDocumentFileId } = props;

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile'],
  );

  documentMetadata = { ...documentMetadata, docketNumber, caseId };

  const caseDetail = await applicationContext
    .getUseCases()
    .submitCaseAssociationRequest({
      applicationContext,
      documentMetadata,
      primaryDocumentFileId,
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

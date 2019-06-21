import { setupPercentDone } from '../createCaseFromPaperAction';
import { state } from 'cerebral';

/**
 * Set document title.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based on if creation was successful or error
 */
export const fileExternalDocumentAction = async ({
  get,
  store,
  applicationContext,
  path,
}) => {
  const { docketNumber, caseId } = get(state.caseDetail);
  const userRole = get(state.user.role);
  const isRespondent = userRole === 'respondent';

  let {
    primaryDocumentFile,
    secondaryDocumentFile,
    supportingDocumentFile,
    secondarySupportingDocumentFile,
    ...documentMetadata
  } = get(state.form);

  documentMetadata = { ...documentMetadata, docketNumber, caseId };

  const progressFunctions = setupPercentDone(
    {
      primary: primaryDocumentFile,
      primarySupporting: supportingDocumentFile,
      secondary: secondaryDocumentFile,
      secondarySupporting: secondarySupportingDocumentFile,
    },
    store,
  );

  let caseDetail;

  try {
    caseDetail = await applicationContext.getUseCases().uploadExternalDocument({
      applicationContext,
      documentMetadata,
      onPrimarySupportingUploadProgress: progressFunctions.primarySupporting,
      onPrimaryUploadProgress: progressFunctions.primary,
      onSecondarySupportUploadProgress: progressFunctions.secondarySupporting,
      onSecondaryUploadProgress: progressFunctions.secondary,
      primaryDocumentFile,
      secondaryDocumentFile,
      secondarySupportingDocumentFile,
      supportingDocumentFile,
    });

    if (isRespondent) {
      await applicationContext.getUseCases().submitCaseAssociationRequest({
        applicationContext,
        caseId,
      });
    }
  } catch (err) {
    return path.error();
  }

  for (let document of caseDetail.documents) {
    if (document.processingStatus === 'pending') {
      await applicationContext.getUseCases().createCoverSheet({
        applicationContext,
        caseId: caseDetail.caseId,
        documentId: document.documentId,
      });
    }
  }

  return path.success({
    caseDetail,
    caseId: docketNumber,
  });
};

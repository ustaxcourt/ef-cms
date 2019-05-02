import { state } from 'cerebral';

/**
 * Set document title.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Object} providers.props the cerebral props object
 */
export const fileExternalDocumentAction = async ({
  get,
  store,
  applicationContext,
}) => {
  const { docketNumber, caseId } = get(state.caseDetail);

  let {
    primaryDocumentFile,
    secondaryDocumentFile,
    supportingDocumentFile,
    secondarySupportingDocumentFile,
    ...documentMetadata
  } = get(state.form);

  documentMetadata = { ...documentMetadata, docketNumber, caseId };

  let totalSize = 0;
  let loadedAmounts = {};

  const calculateTotalLoaded = () => {
    return Object.keys(loadedAmounts).reduce((acc, key) => {
      return loadedAmounts[key] + acc;
    }, 0);
  };

  if (primaryDocumentFile) totalSize += primaryDocumentFile.size;
  if (secondaryDocumentFile) totalSize += secondaryDocumentFile.size;
  if (supportingDocumentFile) totalSize += supportingDocumentFile.size;
  if (secondarySupportingDocumentFile)
    totalSize += secondarySupportingDocumentFile.size;

  const createOnUploadProgress = key => {
    loadedAmounts[key] = 0;
    return progressEvent => {
      const { loaded } = progressEvent;
      loadedAmounts[key] = loaded;
      const percent = parseInt((calculateTotalLoaded() / totalSize) * 100);
      store.set(state.percentComplete, percent);
    };
  };

  const caseDetail = await applicationContext
    .getUseCases()
    .uploadExternalDocument({
      applicationContext,
      documentMetadata,
      onPrimarySupportingUploadProgress: createOnUploadProgress(
        'primary-supporting',
      ),
      onPrimaryUploadProgress: createOnUploadProgress('primary'),
      onSecondarySupportUploadProgress: createOnUploadProgress(
        'secondary-support',
      ),
      onSecondaryUploadProgress: createOnUploadProgress('secondary'),
      primaryDocumentFile,
      secondaryDocumentFile,
      secondarySupportingDocumentFile,
      supportingDocumentFile,
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

import { setupPercentDone } from '../createCaseFromPaperAction';
import { state } from 'cerebral';

/**
 * upload document to s3.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 * @param {Function} providers.store the cerebral store function
 * @returns {object} the next path based on if validation was successful or error
 */
export const uploadExternalDocumentsAction = async ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const form = get(state.form);

  const documentMetadata = {
    ...form,
    caseId,
    docketNumber,
  };

  const documentFiles = {
    primary: form.primaryDocumentFile,
  };

  if (form.secondaryDocumentFile) {
    documentFiles.secondary = form.secondaryDocumentFile;
  }

  if (form.hasSupportingDocuments) {
    form.supportingDocuments.forEach((item, idx) => {
      documentFiles[`primarySupporting${idx}`] = item.supportingDocumentFile;
    });
  }

  if (form.hasSecondarySupportingDocuments) {
    form.secondarySupportingDocuments.forEach((item, idx) => {
      documentFiles[`secondarySupporting${idx}`] = item.supportingDocumentFile;
    });
  }

  const progressFunctions = setupPercentDone(documentFiles, store);

  let caseDetail;

  try {
    caseDetail = await applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor({
        applicationContext,
        documentFiles,
        documentMetadata,
        progressFunctions,
      });
  } catch (err) {
    return path.error();
  }

  const pendingDocuments = caseDetail.documents.filter(
    document =>
      document.processingStatus === 'pending' &&
      document.isFileAttached !== false,
  );
  const addCoversheet = document => {
    return applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      caseId: caseDetail.caseId,
      documentId: document.documentId,
    });
  };

  for (let pendingDocument of pendingDocuments) {
    await addCoversheet(pendingDocument);
  }

  return path.success({
    caseDetail,
    caseId,
    docketNumber,
    documentsFiled: documentMetadata,
  });
};

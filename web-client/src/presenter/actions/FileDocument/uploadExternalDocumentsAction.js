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
  const { caseId, docketNumber, leadCaseId } = get(state.caseDetail);
  const form = get(state.form);

  const documentMetadata = { ...form, caseId, docketNumber };

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

  let cases;

  try {
    cases = await applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor({
        applicationContext,
        documentFiles,
        documentMetadata,
        leadCaseId,
        progressFunctions,
      });
  } catch (err) {
    return path.error();
  }

  const getPendingDocumentsForCase = caseDetail =>
    caseDetail.documents.filter(
      document => document.processingStatus === 'pending',
    );

  let pendingDocuments = [];
  let caseToReturn;

  if (Array.isArray(cases)) {
    cases.forEach(caseDetail => {
      pendingDocuments.push(...getPendingDocumentsForCase(caseDetail));
      if (
        caseDetail.leadCaseId &&
        caseDetail.leadCaseId === caseDetail.caseId
      ) {
        caseToReturn = caseDetail; // TODO: Unsure if this is the best approach
      }
    });
  } else {
    pendingDocuments = getPendingDocumentsForCase(cases);
    caseToReturn = cases;
  }

  const addCoversheet = document => {
    return applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      caseId: document.caseId,
      documentId: document.documentId,
    });
  };

  await Promise.all(pendingDocuments.map(addCoversheet));

  return path.success({
    caseDetail: caseToReturn,
    caseId: docketNumber,
    documentsFiled: documentMetadata,
  });
};

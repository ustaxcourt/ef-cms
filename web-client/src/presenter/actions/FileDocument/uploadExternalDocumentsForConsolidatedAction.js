import { setupPercentDone } from '../createCaseFromPaperAction';
import { state } from 'cerebral';

/**
 * upload document to s3 for consolidated cases.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 * @param {Function} providers.store the cerebral store function
 * @returns {object} the next path based on if validation was successful or error
 */
export const uploadExternalDocumentsForConsolidatedAction = async ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const currentCase = get(state.caseDetail);
  const { docketNumber, leadDocketNumber } = currentCase;
  const form = get(state.form);
  const { selectedCases } = form;

  const documentMetadata = { ...form, docketNumber };

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

  let cases = [];

  try {
    cases = await applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor({
        applicationContext,
        docketNumbersForFiling: selectedCases,
        documentFiles,
        documentMetadata,
        leadDocketNumber,
        progressFunctions,
      });
  } catch (err) {
    return path.error();
  }

  const getPendingDocumentsForCase = caseDetail =>
    caseDetail.docketEntries.filter(
      document => document.processingStatus === 'pending',
    );

  const pendingDocuments = [];

  cases.forEach(caseDetail => {
    pendingDocuments.push(...getPendingDocumentsForCase(caseDetail));
  });

  const addCoversheet = document => {
    return applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      docketEntryId: document.docketEntryId,
      docketNumber,
    });
  };

  await Promise.all(pendingDocuments.map(addCoversheet));

  return path.success({
    caseDetail: currentCase,
    consolidatedCases: cases,
    docketNumber,
    documentsFiled: documentMetadata,
  });
};

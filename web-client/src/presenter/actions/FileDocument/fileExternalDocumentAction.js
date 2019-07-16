import { setupPercentDone } from '../createCaseFromPaperAction';
import { state } from 'cerebral';

/**
 * File external documents
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based on if creation was successful or error
 */
export const fileExternalDocumentAction = async ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const userRole = get(state.user.role);
  const isRespondent = userRole === 'respondent';

  const form = get(state.form);

  const documentFiles = {
    primary: form.primaryDocumentFile,
    secondary: form.secondaryDocumentFile
  };

  if (form.hasSupportingDocuments) {
    form.supportingDocuments.forEach((item, idx) => {
      documentFiles[`primarySupporting${idx}`] = item.supportingDocumentFile;
    })
  }

  if (form.hasSecondarySupportingDocuments) {
    form.secondarySupportingDocuments.forEach((item, idx) => {
      documentFiles[`secondarySupporting${idx}`] = item.secondarySupportingDocumentFile;
    })
  }

  const documentMetadata = { ...form, docketNumber, caseId };

  const progressFunctions = setupPercentDone(
    documentFiles,
    store,
  );

  let caseDetail;

  try {
    caseDetail = await applicationContext
      .getUseCases()
      .uploadExternalDocumentInteractor({
        applicationContext,
        documentMetadata,
        documentFiles,
        progressFunctions,
      });

    if (isRespondent) {
      await applicationContext
        .getUseCases()
        .submitCaseAssociationRequestInteractor({
          applicationContext,
          caseId,
        });
    }
  } catch (err) {
    return path.error();
  }

  for (let document of caseDetail.documents) {
    if (document.processingStatus === 'pending') {
      await applicationContext.getUseCases().createCoverSheetInteractor({
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

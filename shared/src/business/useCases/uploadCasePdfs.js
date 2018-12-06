const Case = require('../entities/Case');
const Document = require('../entities/Document');

/**
 * uploadCasePdfs
 * @param applicationContext
 * @param caseInitiator
 * @param user
 * @param fileHasUploaded
 * @returns {Promise<{petitionFileId, requestForPlaceOfTrialId, statementOfTaxpayerIdentificationNumberId}>}
 */
exports.uploadCasePdfs = async ({
  applicationContext,
  caseInitiator,
  userId,
  fileHasUploaded,
}) => {
  const policy = await applicationContext
    .getPersistenceGateway()
    .getUploadPolicy({ applicationContext });

  const petitionDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadPdf({
      policy,
      file: caseInitiator.petitionFile,
    });
  fileHasUploaded();

  const petitionDocument = new Document({
    documentType: Case.documentTypes.answer,
    userId: userId,
    documentId: petitionDocumentId,
  });

  const requestForPlaceOfTrialDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadPdf({
      policy,
      file: caseInitiator.requestForPlaceOfTrial,
    });
  fileHasUploaded();

  const requestForPlaceOfTrialDocument = new Document({
    documentType: Case.documentTypes.requestForPlaceOfTrial,
    userId: userId,
    documentId: requestForPlaceOfTrialDocumentId,
  });

  const statementOfTaxpayerIdentificationNumberDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadPdf({
      policy,
      file: caseInitiator.statementOfTaxpayerIdentificationNumber,
    });
  fileHasUploaded();

  const statementOfTaxpayerIdentificationNumberDocument = new Document({
    documentType: Case.documentTypes.statementOfTaxpayerIdentificationNumber,
    userId: userId,
    documentId: statementOfTaxpayerIdentificationNumberDocumentId,
  });

  return {
    petitionDocument,
    requestForPlaceOfTrialDocument,
    statementOfTaxpayerIdentificationNumberDocument,
  };
};

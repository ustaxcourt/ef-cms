const Case = require('../entities/Case');
const CaseInitiator = require('../entities/CaseInitiator');

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
  caseInitiator = new CaseInitiator(caseInitiator);
  caseInitiator = caseInitiator.exportObject();

  const policy = await applicationContext
    .getPersistenceGateway()
    .getDocumentUploadPolicy({ applicationContext });

  const petitionDocument = await applicationContext
    .getPersistenceGateway()
    .createDocumentMetadataRequest({
      applicationContext,
      userId: userId,
      documentType: Case.documentTypes.petitionFile,
    });

  const requestForPlaceOfTrialDocument = await applicationContext
    .getPersistenceGateway()
    .createDocumentMetadataRequest({
      applicationContext,
      userId: userId,
      documentType: Case.documentTypes.requestForPlaceOfTrial,
    });

  const statementOfTaxpayerIdentificationNumberDocument = await applicationContext
    .getPersistenceGateway()
    .createDocumentMetadataRequest({
      applicationContext,
      userId: userId,
      documentType: Case.documentTypes.statementOfTaxpayerIdentificationNumber,
    });

  await applicationContext.getPersistenceGateway().uploadPdf({
    policy,
    documentId: petitionDocument.documentId,
    file: caseInitiator.petitionFile,
  });
  fileHasUploaded();

  await applicationContext.getPersistenceGateway().uploadPdf({
    policy,
    documentId: requestForPlaceOfTrialDocument.documentId,
    file: caseInitiator.requestForPlaceOfTrial,
  });
  fileHasUploaded();

  await applicationContext.getPersistenceGateway().uploadPdf({
    policy,
    documentId: statementOfTaxpayerIdentificationNumberDocument.documentId,
    file: caseInitiator.statementOfTaxpayerIdentificationNumber,
  });
  fileHasUploaded();

  return {
    petitionDocument,
    requestForPlaceOfTrialDocument,
    statementOfTaxpayerIdentificationNumberDocument,
  };
};

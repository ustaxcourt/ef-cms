const axios = require('axios');

const Case = require('../entities/Case');

/**
 * createDocumentMetadata
 * @param applicationContext
 * @param userId
 * @param documentType
 * @returns {Promise<*>}
 */
const createDocumentMetadata = async ({
  applicationContext,
  userId,
  documentType,
}) => {
  const userToken = userId; // TODO fix with jwt
  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/documents`,
    {
      documentType,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
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
    .getDocumentUploadPolicy({ applicationContext });

  const petitionDocument = await createDocumentMetadata({
    applicationContext,
    userId: userId,
    documentType: Case.documentTypes.petitionFile,
  });

  const requestForPlaceOfTrialDocument = await createDocumentMetadata({
    applicationContext,
    userId: userId,
    documentType: Case.documentTypes.requestForPlaceOfTrial,
  });

  const statementOfTaxpayerIdentificationNumberDocument = await createDocumentMetadata(
    {
      applicationContext,
      userId: userId,
      documentType: Case.documentTypes.statementOfTaxpayerIdentificationNumber,
    },
  );

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

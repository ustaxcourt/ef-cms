const axios = require('axios');

const Case = require('../entities/Case');

/**
 * getDocumentPolicy
 * @param applicationContext
 * @returns {Promise<*>}
 */
// TODO: move to persistence gateway
const getDocumentPolicy = async ({ applicationContext }) => {
  const response = await axios.get(
    `${applicationContext.getBaseUrl()}/documents/uploadPolicy`,
  );
  return response.data;
};
/**
 * createDocumentMetadata
 * @param applicationContext
 * @param userToken
 * @param documentType
 * @returns {Promise<*>}
 */
const createDocumentMetadata = async ({
  applicationContext,
  userToken,
  documentType,
}) => {
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
module.exports = async ({
  applicationContext,
  caseInitiator,
  user,
  fileHasUploaded,
}) => {
  const policy = await getDocumentPolicy({ applicationContext });

  const { documentId: petitionFileId } = await createDocumentMetadata({
    applicationContext,
    userToken: user.token,
    documentType: Case.documentTypes.petitionFile,
  });

  const { documentId: requestForPlaceOfTrialId } = await createDocumentMetadata(
    {
      applicationContext,
      userToken: user.token,
      documentType: Case.documentTypes.requestForPlaceOfTrial,
    },
  );

  const {
    documentId: statementOfTaxpayerIdentificationNumberId,
  } = await createDocumentMetadata({
    applicationContext,
    userToken: user.token,
    documentType: Case.documentTypes.statementOfTaxpayerIdentificationNumber,
  });

  await applicationContext.getPersistenceGateway().uploadPdf({
    policy,
    documentId: petitionFileId,
    file: caseInitiator.petitionFile,
  });
  fileHasUploaded();

  await applicationContext.getPersistenceGateway().uploadPdf({
    policy,
    documentId: requestForPlaceOfTrialId,
    file: caseInitiator.requestForPlaceOfTrial,
  });
  fileHasUploaded();

  await applicationContext.getPersistenceGateway().uploadPdf({
    policy,
    documentId: statementOfTaxpayerIdentificationNumberId,
    file: caseInitiator.statementOfTaxpayerIdentificationNumber,
  });
  fileHasUploaded();

  return {
    petitionFileId,
    requestForPlaceOfTrialId,
    statementOfTaxpayerIdentificationNumberId,
  };
};

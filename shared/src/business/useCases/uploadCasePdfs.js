const CaseInitiator = require('../entities/CaseInitiator');
const CaseInitiatorResponse = require('../entities/CaseInitiatorResponse');

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
  fileHasUploaded,
}) => {
  caseInitiator = new CaseInitiator(caseInitiator);
  caseInitiator.validate();

  const documentIDs = await applicationContext
    .getPersistenceGateway()
    .uploadPdfsForNewCase({
      applicationContext,
      caseInitiator: caseInitiator.toJSON(),
      fileHasUploaded,
    });

  new CaseInitiatorResponse(documentIDs).validate();

  return documentIDs;
};

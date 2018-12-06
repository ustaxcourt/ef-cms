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
  fileHasUploaded,
}) => {
  caseInitiator = new CaseInitiator(caseInitiator);
  caseInitiator = caseInitiator.exportObject();

  const documentIDs = await applicationContext
    .getPersistenceGateway()
    .uploadPdfsForNewCase({
      applicationContext,
      caseInitiator,
      fileHasUploaded,
    });

  return documentIDs;
};

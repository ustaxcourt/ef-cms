const CaseInitiator = require('../entities/CaseInitiator');
const { CaseInitiatorResponse } = require('../entities/CaseInitiatorResponse');

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
  new CaseInitiator(caseInitiator).validate();
  const documentIDs = await applicationContext
    .getPersistenceGateway()
    .uploadPdfsForNewCase({
      applicationContext,
      caseInitiator: new CaseInitiator(caseInitiator).validate(), // cannot call toJSON because caseinitiator holds a formdata and blob
      fileHasUploaded,
    });

  new CaseInitiatorResponse(documentIDs).validate();

  return documentIDs;
};

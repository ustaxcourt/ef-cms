const CaseInitiator = require('../entities/CaseInitiator');

const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

const uuidVersions = {
  version: ['uuidv4'],
};

function CaseInitiatorResponseValidator(rawResponse) {
  Object.assign(this, rawResponse);
}

joiValidationDecorator(
  CaseInitiatorResponseValidator,
  joi.object().keys({
    petitionDocumentId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    requestForPlaceOfTrialDocumentId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    statementOfTaxpayerIdentificationNumberDocumentId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
  }),
);

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
      caseInitiator: new CaseInitiator(caseInitiator).validate(), // cannot call toRawObject because caseinitiator holds a formdata and blob
      fileHasUploaded,
    });

  new CaseInitiatorResponseValidator(documentIDs).validate();

  return documentIDs;
};

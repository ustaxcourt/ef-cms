const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionFormValidator(rawResponse) {
  Object.assign(this, rawResponse);
}

joiValidationDecorator(
  PetitionFormValidator,
  joi.object().keys({
    caseType: joi.string().required(),
    irsNoticeDate: joi.string().required(),
    // irsNoticeFile: joi.object().required(),
    petitionFile: joi.object().required(),
    procedureType: joi.string().required(),
    trialLocation: joi.string().required(),
  }),
);

/**
 * uploadCasePdfs
 * @param applicationContext
 * @param caseInitiator
 * @param user
 * @param fileHasUploaded
 * @returns {Promise<{petitionFileId}>}
 */
exports.validatePetitionForm = ({ petitionForm }) => {
  const { error } = new PetitionFormValidator(
    petitionForm,
  ).getValidationErrors();
  if (!error) return null;
  const errors = {};
  error.details.forEach(detail => {
    errors[detail.context.key] = detail.message;
  });
  return errors;
};

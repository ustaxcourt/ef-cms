const Petition = require('../entities/Petition');

/**
 * validatePetition
 * @param applicationContext
 * @param caseInitiator
 * @param user
 * @param fileHasUploaded
 * @returns {Promise<{petitionFileId}>}
 */
exports.validatePetition = ({ petition }) => {
  const { error } = new Petition(petition).getValidationErrors();
  if (!error) return null;
  const errors = {};
  error.details.forEach(detail => {
    errors[detail.context.key] = detail.message;
  });
  return errors;
};

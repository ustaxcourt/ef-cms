/**
 * validatePetition
 * @param applicationContext
 * @param caseInitiator
 * @param user
 * @param fileHasUploaded
 * @returns {Promise<{petitionFileId}>}
 */
exports.validatePetition = ({ petition, applicationContext }) => {
  const { error } = new (applicationContext.getEntityConstructors()).Petition(
    petition,
  ).getValidationErrors();
  if (!error) return null;
  const errors = {};
  error.details.forEach(detail => {
    errors[detail.context.key] = detail.message;
  });
  return errors;
};

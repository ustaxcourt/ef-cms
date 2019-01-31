/**
 * validatePetition
 * @param applicationContext
 * @param caseInitiator
 * @param user
 * @param fileHasUploaded
 * @returns {Promise<{petitionFileId}>}
 */
exports.validatePetition = ({ petition, applicationContext }) => {
  const errors = new (applicationContext.getEntityConstructors()).Petition(
    petition,
  ).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};

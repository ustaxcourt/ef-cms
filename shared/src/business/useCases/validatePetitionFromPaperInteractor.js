/**
 * validatePetition
 * @param applicationContext
 * @param user
 * @param fileHasUploaded
 * @returns {Promise<{petitionFileId}>}
 */
exports.validatePetitionFromPaper = ({ petition, applicationContext }) => {
  const errors = new (applicationContext.getEntityConstructors()).PetitionFromPaper(
    petition,
  ).getFormattedValidationErrors();
  if (!errors) return null;

  return errors;
};

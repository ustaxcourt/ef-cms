/**
 * validatePetition
 * @param petition
 * @param applicationContext
 * @returns {Promise<{petitionFileId}>}
 */
exports.validatePetitionFromPaper = ({ applicationContext, petition }) => {
  const errors = new (applicationContext.getEntityConstructors()).PetitionFromPaper(
    petition,
  ).getFormattedValidationErrors();
  if (!errors) return null;

  return errors;
};

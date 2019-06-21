/**
 * validatePetition
 * @param petition
 * @param applicationContext
 * @returns {Promise<{petitionFileId}>}
 */
exports.validatePetition = ({ applicationContext, petition }) => {
  const errors = new (applicationContext.getEntityConstructors()).Petition(
    petition,
  ).getFormattedValidationErrors();
  if (!errors) return null;

  return errors;
};

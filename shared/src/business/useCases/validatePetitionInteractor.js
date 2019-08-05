/**
 * validatePetitionInteractor
 * @param petition
 * @param applicationContext
 * @returns {Promise<{petitionFileId}>}
 */
exports.validatePetitionInteractor = ({ applicationContext, petition }) => {
  const errors = new (applicationContext.getEntityConstructors()).CaseExternal(
    petition,
  ).getFormattedValidationErrors();
  return errors || null;
};

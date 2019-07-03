/**
 * validatePetition
 * @param petition
 * @param applicationContext
 * @returns {Promise<{petitionFileId}>}
 */
exports.validatePetitionFromPaperInteractor = ({
  applicationContext,
  petition,
}) => {
  const errors = new (applicationContext.getEntityConstructors()).CaseInternal(
    petition,
  ).getFormattedValidationErrors();
  if (!errors) return null;

  return errors;
};

/**
 * validatePetition
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.petition the petition data to validate
 * @returns {object} errors (null if no errors)
 */
exports.validatePetitionFromPaperInteractor = ({
  applicationContext,
  petition,
}) => {
  const errors = new (applicationContext.getEntityConstructors()).CaseInternal(
    petition,
  ).getFormattedValidationErrors();
  return errors || null;
};

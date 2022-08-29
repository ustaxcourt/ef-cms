const { CaseInternal } = require('../entities/cases/CaseInternal');

/**
 * validatePetitionFromPaper
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.petition the petition data to validate
 * @returns {object} errors (null if no errors)
 */
exports.validatePetitionFromPaperInteractor = (
  applicationContext,
  { petition },
) => {
  const errors = new CaseInternal(petition, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};

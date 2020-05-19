const { CaseInternal } = require('../entities/cases/CaseInternal');

/**
 * validatePetitionFromPaper
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
  console.log('petition', petition);
  const errors = new CaseInternal(petition, {
    applicationContext,
  }).getFormattedValidationErrors();
  console.log('errors', errors);
  return errors || null;
};

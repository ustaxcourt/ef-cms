const { NewPractitioner } = require('../../entities/NewPractitioner');

/**
 * validatePractitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.practitioner metadata
 * @returns {object} errors
 */
exports.validateAddPractitionerInteractor = (
  applicationContext,
  { practitioner },
) => {
  const errors = new NewPractitioner(practitioner, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

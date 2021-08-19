const { Practitioner } = require('../../entities/Practitioner');

/**
 * validatePractitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.practitioner metadata
 * @returns {object} errors
 */
exports.validatePractitionerInteractor = (
  applicationContext,
  { practitioner },
) => {
  const errors = new Practitioner(practitioner, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

const { NewPractitioner } = require('../../entities/NewPractitioner');

/**
 * validatePractitionerInteractor
 *
 * @param {object} params params
 * @param {object} params.applicationContext the application context
 * @param {object} params.practitioner metadata
 * @returns {object} errors
 */
exports.validateAddPractitionerInteractor = ({
  applicationContext,
  practitioner,
}) => {
  const errors = new NewPractitioner(practitioner, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

const { Practitioner } = require('../../entities/Practitioner');

/**
 * validatePractitionerInteractor
 *
 * @param {object} params params
 * @param {object} params.applicationContext the application context
 * @param {object} params.practitioner metadata
 * @returns {object} errors
 */
exports.validatePractitionerInteractor = ({
  applicationContext,
  practitioner,
}) => {
  const errors = new Practitioner(practitioner, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

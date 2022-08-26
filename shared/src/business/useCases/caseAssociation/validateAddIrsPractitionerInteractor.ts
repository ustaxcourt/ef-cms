const {
  AddIrsPractitioner,
} = require('../../entities/caseAssociation/AddIrsPractitioner');

/**
 * validateAddIrsPractitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.counsel the practitioner to validate
 * @returns {object} errors
 */
exports.validateAddIrsPractitionerInteractor = (
  applicationContext,
  { counsel },
) => {
  const errors = new AddIrsPractitioner(counsel, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

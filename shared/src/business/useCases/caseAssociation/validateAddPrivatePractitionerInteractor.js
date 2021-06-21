const {
  AddPrivatePractitionerFactory,
} = require('../../entities/caseAssociation/AddPrivatePractitionerFactory');

/**
 * validateAddPrivatePractitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.counsel the practitioner to validate
 * @returns {object} errors
 */
exports.validateAddPrivatePractitionerInteractor = (
  applicationContext,
  { counsel },
) => {
  const errors = AddPrivatePractitionerFactory.get(counsel, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

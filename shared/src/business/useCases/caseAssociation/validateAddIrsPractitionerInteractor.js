const {
  AddIrsPractitioner,
} = require('../../entities/caseAssociation/AddIrsPractitioner');

/**
 * validateAddIrsPractitionerInteractor
 *
 * @param {object} params params
 * @param {object} params.applicationContext the application context
 * @param {object} params.counsel metadata
 * @returns {object} errors
 */
exports.validateAddIrsPractitionerInteractor = ({
  applicationContext,
  counsel,
}) => {
  const errors = new AddIrsPractitioner(counsel, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

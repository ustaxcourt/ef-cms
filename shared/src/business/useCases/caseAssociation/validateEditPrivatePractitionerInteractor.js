const {
  EditPrivatePractitionerFactory,
} = require('../../entities/caseAssociation/EditPrivatePractitionerFactory');

/**
 * validateEditPrivatePractitionerInteractor
 *
 * @param {object} params params
 * @param {object} params.applicationContext the application context
 * @param {object} params.practitioner metadata
 * @returns {object} errors
 */
exports.validateEditPrivatePractitionerInteractor = ({
  applicationContext,
  practitioner,
}) => {
  const errors = EditPrivatePractitionerFactory.get(practitioner, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

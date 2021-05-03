const {
  EditPrivatePractitionerFactory,
} = require('../../entities/caseAssociation/EditPrivatePractitionerFactory');

/**
 * validateEditPetitionerCounselInteractor
 *
 * @param {object} params params
 * @param {object} params.applicationContext the application context
 * @param {object} params.practitioner metadata
 * @returns {object} errors
 */
exports.validateEditPetitionerCounselInteractor = ({
  applicationContext,
  practitioner,
}) => {
  const errors = EditPrivatePractitionerFactory.get(practitioner, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

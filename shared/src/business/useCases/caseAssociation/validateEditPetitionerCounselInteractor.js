const {
  EditPetitionerCounselFactory,
} = require('../../entities/caseAssociation/EditPetitionerCounselFactory');

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
  const errors = EditPetitionerCounselFactory.get(practitioner, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

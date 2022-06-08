const {
  EditPetitionerCounselFactory,
} = require('../../entities/caseAssociation/EditPetitionerCounselFactory');

/**
 * validateEditPetitionerCounselInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.practitioner the petitioner counsel to validate
 * @returns {object} errors
 */
exports.validateEditPetitionerCounselInteractor = ({ practitioner }) => {
  return EditPetitionerCounselFactory(
    practitioner,
  ).getFormattedValidationErrors();
};

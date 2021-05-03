const {
  AddPetitionerCounselFactory,
} = require('../../entities/caseAssociation/AddPetitionerCounselFactory');

/**
 * validateAddPetitionerCounselFactory
 *
 * @param {object} params params
 * @param {object} params.applicationContext the application context
 * @param {object} params.counsel metadata
 * @returns {object} errors
 */
exports.validateAddPetitionerCounselInteractor = ({
  applicationContext,
  counsel,
}) => {
  const errors = AddPetitionerCounselFactory.get(counsel, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

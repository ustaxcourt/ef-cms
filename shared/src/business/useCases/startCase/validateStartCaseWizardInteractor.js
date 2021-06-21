const {
  CaseExternalInformationFactory,
} = require('../../entities/cases/CaseExternalInformationFactory');

/**
 * validateStartCaseWizardInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.petition the petition data
 * @returns {object} errors (null if no errors)
 */
exports.validateStartCaseWizardInteractor = (
  applicationContext,
  { petition },
) => {
  const errors = new CaseExternalInformationFactory(petition, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};

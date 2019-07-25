/**
 * validateStartCaseWizardInteractor
 * @param petition
 * @param applicationContext
 * @returns {object}
 */
exports.validateStartCaseWizardInteractor = ({
  applicationContext,
  petition,
}) => {
  const errors = new (applicationContext.getEntityConstructors()).CaseExternalInformationFactory(
    petition,
  ).getFormattedValidationErrors();
  return errors || null;
};

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
  const errors = new (applicationContext.getEntityConstructors().AddIrsPractitioner)(
    counsel,
  ).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

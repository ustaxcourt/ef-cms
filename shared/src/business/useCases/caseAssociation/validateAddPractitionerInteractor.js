/**
 * validateAddPractitionerInteractor
 *
 * @param {object} params params
 * @param {object} params.applicationContext the application context
 * @param {object} params.counsel metadata
 * @returns {object} errors
 */
exports.validateAddPractitionerInteractor = ({
  applicationContext,
  counsel,
}) => {
  const errors = applicationContext
    .getEntityConstructors()
    .AddPractitionerFactory.get(counsel)
    .getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

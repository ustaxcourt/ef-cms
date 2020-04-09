/**
 * validateAddPrivatePractitionerInteractor
 *
 * @param {object} params params
 * @param {object} params.applicationContext the application context
 * @param {object} params.counsel metadata
 * @returns {object} errors
 */
exports.validateAddPrivatePractitionerInteractor = ({
  applicationContext,
  counsel,
}) => {
  const errors = applicationContext
    .getEntityConstructors()
    .AddPrivatePractitionerFactory.get(counsel)
    .getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

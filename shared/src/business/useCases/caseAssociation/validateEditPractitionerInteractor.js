/**
 * validateEditPractitionerInteractor
 *
 * @param {object} params params
 * @param {object} params.applicationContext the application context
 * @param {object} params.practitioner metadata
 * @returns {object} errors
 */
exports.validateEditPractitionerInteractor = ({
  applicationContext,
  practitioner,
}) => {
  const errors = applicationContext
    .getEntityConstructors()
    .EditPractitionerFactory.get(practitioner)
    .getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

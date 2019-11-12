/**
 * validateAddRespondent
 *
 * @param {object} params params
 * @param {object} params.applicationContext the application context
 * @param {object} params.counsel metadata
 * @returns {object} errors
 */
exports.validateAddRespondent = ({ applicationContext, counsel }) => {
  const errors = new (applicationContext.getEntityConstructors().AddRespondent)(
    counsel,
  ).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

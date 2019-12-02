/**
 * validateUserContactInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.petition the petition data to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateUserContactInteractor = ({ applicationContext, user }) => {
  const errors = new (applicationContext.getEntityConstructors()).User(
    user,
  ).getFormattedValidationErrors();
  return errors || null;
};

const { User } = require('../../entities/User');

/**
 * validateUserContactInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.petition the petition data to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateUserContactInteractor = (applicationContext, { user }) => {
  const errors = new User(user, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};

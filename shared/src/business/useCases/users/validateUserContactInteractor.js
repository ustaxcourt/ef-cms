const { UpdateUser } = require('../../entities/UpdateUser');

/**
 * validateUserContactInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.user the user data to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateUserContactInteractor = ({ user }) => {
  const updateUser = new UpdateUser(user);
  return updateUser.getFormattedValidationErrors();
};

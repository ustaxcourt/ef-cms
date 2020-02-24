const { User } = require('../entities/User');

/**
 * getUserInteractor
 *
 * @param {object} user the user to get
 * @returns {User} the retrieved user
 */
exports.getUserInteractor = async ({ applicationContext }) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  return new User(user).validate().toRawObject();
};

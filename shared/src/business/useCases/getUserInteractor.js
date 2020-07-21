const { NotFoundError } = require('../../errors/errors');
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

  if (!user) {
    throw new NotFoundError(
      `User id ${authorizedUser.userId}" not found in persistence.`,
    );
  }

  return new User(user).validate().toRawObject();
};

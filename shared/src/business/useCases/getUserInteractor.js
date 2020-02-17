const { Judge } = require('../entities/Judge');
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

  if (user.role === User.ROLES.judge) {
    return new Judge(user).toRawObject();
  } else {
    return new User(user).toRawObject();
  }
};

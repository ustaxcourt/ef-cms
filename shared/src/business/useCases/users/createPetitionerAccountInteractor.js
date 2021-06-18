const { ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

/**
 * createPetitionerAccountInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.createPetitionerAccountInteractor = async (
  applicationContext,
  { email, name, userId },
) => {
  const userEntity = new User(
    {
      email,
      name,
      role: ROLES.petitioner,
      userId,
    },
    { applicationContext },
  );

  await applicationContext.getPersistenceGateway().persistUser({
    applicationContext,
    user: userEntity.validate().toRawObject(),
  });

  return userEntity.validate().toRawObject();
};

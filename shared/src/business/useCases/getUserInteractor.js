const {
  entityName: irsPractitionerEntityName,
  IrsPractitioner,
} = require('../entities/IrsPractitioner');
const {
  entityName: practitionerEntityName,
  Practitioner,
} = require('../entities/Practitioner');
const {
  entityName: privatePractitionerEntityName,
  PrivatePractitioner,
} = require('../entities/PrivatePractitioner');
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
      `User id "${authorizedUser.userId}" not found in persistence.`,
    );
  }

  if (user.entityName === privatePractitionerEntityName) {
    return new PrivatePractitioner(user).validate().toRawObject();
  } else if (user.entityName === irsPractitionerEntityName) {
    return new IrsPractitioner(user).validate().toRawObject();
  } else if (user.entityName === practitionerEntityName) {
    return new Practitioner(user).validate().toRawObject();
  } else {
    return new User(user).validate().toRawObject();
  }
};

const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { Practitioner } = require('../../entities/Practitioner');

/**
 * getPractitionerByBarNumberInteractor
 *
 * @param {object} userId the id for the user to get
 * @returns {User} the retrieved user
 */
exports.getPractitionerByBarNumberInteractor = async ({
  applicationContext,
  barNumber,
}) => {
  const requestUser = applicationContext.getCurrentUser();

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)) {
    throw new UnauthorizedError('Unauthorized for getting attorney user');
  }

  const practitioner = await applicationContext
    .getPersistenceGateway()
    .getPractitionerByBarNumber({ applicationContext, barNumber });

  if (!practitioner) {
    throw new NotFoundError(
      'No practitioner with the given bar number was found',
    );
  }

  return new Practitioner(practitioner).validate().toRawObject();
};

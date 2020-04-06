const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Practitioner } = require('../../entities/Practitioner');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getPractitionerByBarNumberInteractor
 *
 * @param {object} barNumber the bar number for the practitioner to get
 * @returns {Practitioner} the retrieved practitioner
 */
exports.getPractitionerByBarNumberInteractor = async ({
  applicationContext,
  barNumber,
}) => {
  const requestUser = applicationContext.getCurrentUser();

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)) {
    throw new UnauthorizedError('Unauthorized for getting attorney user');
  }

  const foundPractitioner = await applicationContext
    .getPersistenceGateway()
    .getPractitionerByBarNumber({ applicationContext, barNumber });

  let practitioner;

  if (foundPractitioner) {
    practitioner = new Practitioner(foundPractitioner).validate().toRawObject();
  }

  return practitioner;
};

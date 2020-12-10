const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { generateChangeOfAddress } = require('../users/generateChangeOfAddress');
const { Practitioner } = require('../../entities/Practitioner');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updatePractitionerUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.barNumber the barNumber of the user to update
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.updatePractitionerUserInteractor = async ({
  applicationContext,
  barNumber,
  bypassDocketEntry,
  user,
}) => {
  const requestUser = applicationContext.getCurrentUser();
  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.ADD_EDIT_PRACTITIONER_USER)) {
    throw new UnauthorizedError('Unauthorized for updating practitioner user');
  }

  const oldUserInfo = await applicationContext
    .getPersistenceGateway()
    .getPractitionerByBarNumber({ applicationContext, barNumber });

  if (oldUserInfo.userId !== user.userId) {
    throw new Error('Bar number does not match user data.');
  }

  // do not allow edit of bar number or email
  const validatedUserData = new Practitioner(
    { ...user, barNumber: oldUserInfo.barNumber, email: oldUserInfo.email },
    { applicationContext },
  )
    .validate()
    .toRawObject();

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'admin_contact_initial_update_complete',
    },
    userId: requestUser.userId,
  });

  await generateChangeOfAddress({
    applicationContext,
    bypassDocketEntry,
    contactInfo: validatedUserData.contact,
    requestUserId: requestUser.userId,
    updatedName: validatedUserData.name,
    user: oldUserInfo,
    websocketMessagePrefix: 'admin',
  });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'admin_contact_full_update_complete',
    },
    userId: requestUser.userId,
  });

  const updatedUser = await applicationContext
    .getPersistenceGateway()
    .updatePractitionerUser({
      applicationContext,
      user: validatedUserData,
    });

  return new Practitioner(updatedUser, { applicationContext })
    .validate()
    .toRawObject();
};

const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { generateChangeOfAddress } = require('../users/generateChangeOfAddress');
const { Practitioner } = require('../../entities/Practitioner');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

const updateUserPendingEmail = async ({ applicationContext, user }) => {
  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({
      applicationContext,
      email: user.updatedEmail,
    });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  const pendingEmailVerificationToken = applicationContext.getUniqueId();
  user.pendingEmailVerificationToken = pendingEmailVerificationToken;
  user.pendingEmail = user.updatedEmail;
};

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

  if (
    !isAuthorized(requestUser, ROLE_PERMISSIONS.ADD_EDIT_PRACTITIONER_USER) ||
    !isAuthorized(requestUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)
  ) {
    throw new UnauthorizedError('Unauthorized for updating practitioner user');
  }

  const oldUserInfo = await applicationContext
    .getPersistenceGateway()
    .getPractitionerByBarNumber({ applicationContext, barNumber });

  if (oldUserInfo.userId !== user.userId) {
    throw new Error('Bar number does not match user data.');
  }

  if (!oldUserInfo.email && user.email) {
    user.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
  }

  if (user.updatedEmail) {
    await updateUserPendingEmail({ applicationContext, user });
  }

  // do not allow edit of bar number
  const validatedUserData = new Practitioner(
    {
      ...user,
      barNumber: oldUserInfo.barNumber,
      email: oldUserInfo.email || user.email,
    },
    { applicationContext },
  )
    .validate()
    .toRawObject();

  const updatedUser = await applicationContext
    .getPersistenceGateway()
    .updatePractitionerUser({
      applicationContext,
      user: validatedUserData,
    });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'admin_contact_initial_update_complete',
    },
    userId: requestUser.userId,
  });

  if (user.updatedEmail) {
    await applicationContext.getUseCaseHelpers().sendEmailVerificationLink({
      applicationContext,
      pendingEmail: user.pendingEmail,
      pendingEmailVerificationToken: user.pendingEmailVerificationToken,
    });
  }

  await generateChangeOfAddress({
    applicationContext,
    bypassDocketEntry,
    contactInfo: validatedUserData.contact,
    requestUserId: requestUser.userId,
    updatedEmail: validatedUserData.email,
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

  return new Practitioner(updatedUser, { applicationContext })
    .validate()
    .toRawObject();
};

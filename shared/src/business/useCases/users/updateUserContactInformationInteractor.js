const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { generateChangeOfAddress } = require('./generateChangeOfAddress');
const { isEqual } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * updateUserContactInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.userId the userId to update the contact info
 * @returns {Promise} an object is successful
 */
const updateUserContactInformationInteractor = async ({
  applicationContext,
  contactInfo,
  userId,
}) => {
  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  if (isEqual(user.contact, contactInfo)) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_initial_update_complete',
      },
      userId: user.userId,
    });
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_full_update_complete',
      },
      userId: user.userId,
    });
    return;
  }

  const userEntity = new User({
    ...user,
    contact: { ...contactInfo },
  });

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: userEntity.validate().toRawObject(),
  });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'user_contact_initial_update_complete',
    },
    userId: user.userId,
  });

  await generateChangeOfAddress({
    applicationContext,
    contactInfo,
    user: userEntity.validate().toRawObject(),
  });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'user_contact_full_update_complete',
    },
    userId: user.userId,
  });
};

/**
 * updateUserContactInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.userId the userId to update the contact info
 * @returns {Promise} an object is successful
 */
exports.updateUserContactInformationInteractor = async ({
  applicationContext,
  contactInfo,
  userId,
}) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authenticatedUser, ROLE_PERMISSIONS.UPDATE_CONTACT_INFO) ||
    authenticatedUser.userId !== userId
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  try {
    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId,
    });
  } catch (error) {
    const { userId } = applicationContext.getCurrentUser();

    applicationContext.logger.info('Error', error);
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_update_error',
        error,
      },
      userId,
    });
    await applicationContext.notifyHoneybadger(error);
  }
};

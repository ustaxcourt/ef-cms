const {
  entityName: irsPractitionerEntityName,
  IrsPractitioner,
} = require('../../entities/IrsPractitioner');
const {
  entityName: practitionerEntityName,
  Practitioner,
} = require('../../entities/Practitioner');
const {
  entityName: privatePractitionerEntityName,
  PrivatePractitioner,
} = require('../../entities/PrivatePractitioner');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { generateChangeOfAddress } = require('./generateChangeOfAddress');
const { isEqual } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

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

  let userEntity;
  if (user.entityName === privatePractitionerEntityName) {
    userEntity = new PrivatePractitioner({
      ...user,
      contact: { ...contactInfo },
      isUpdatingInformation: true,
    });
  } else if (user.entityName === irsPractitionerEntityName) {
    userEntity = new IrsPractitioner({
      ...user,
      contact: { ...contactInfo },
      isUpdatingInformation: true,
    });
  } else if (user.entityName === practitionerEntityName) {
    userEntity = new Practitioner({
      ...user,
      contact: { ...contactInfo },
      isUpdatingInformation: true,
    });
  } else {
    throw new Error(`Unrecognized entityType ${user.entityName}`);
  }

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

  userEntity.isUpdatingInformation = false;

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: userEntity.validate().toRawObject(),
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
        error: error.toString(),
      },
      userId,
    });
    await applicationContext.notifyHoneybadger(error);
  }
};

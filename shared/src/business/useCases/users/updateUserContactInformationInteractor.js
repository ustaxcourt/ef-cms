const {
  entityName: irsPractitionerEntityName,
} = require('../../entities/IrsPractitioner');
const {
  entityName: practitionerEntityName,
  Practitioner,
} = require('../../entities/Practitioner');
const {
  entityName: privatePractitionerEntityName,
} = require('../../entities/PrivatePractitioner');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { generateChangeOfAddress } = require('./generateChangeOfAddress');
const { isEqual } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateUserContactInformationHelper
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.userId the userId to update the contact info
 * @param {string} providers.firmName firmName to update if a privatePractitioner is updating their info
 * @returns {Promise} an object is successful
 */
const updateUserContactInformationHelper = async (
  applicationContext,
  { contactInfo, firmName, userId },
) => {
  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  const isPractitioner = u => {
    return (
      u.entityName === privatePractitionerEntityName ||
      u.entityName === irsPractitionerEntityName ||
      u.entityName === practitionerEntityName
    );
  };

  const isPractitionerUnchanged = u =>
    isPractitioner(u) &&
    isEqual(user.contact, contactInfo) &&
    isEqual(user.firmName, firmName);

  const isUserUnchanged = u =>
    !isPractitioner(u) && isEqual(user.contact, contactInfo);

  if (isPractitionerUnchanged(user) || isUserUnchanged(user)) {
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
  if (
    user.entityName === privatePractitionerEntityName ||
    user.entityName === irsPractitionerEntityName ||
    user.entityName === practitionerEntityName
  ) {
    userEntity = new Practitioner({
      ...user,
      contact: { ...contactInfo },
      isUpdatingInformation: true,
    });

    userEntity.firmName = firmName;
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

  // prevent the progress bar component from showing when updating ONLY the firmName
  await generateChangeOfAddress({
    applicationContext,
    contactInfo,
    firmName,
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
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.userId the userId to update the contact info
 */
exports.updateUserContactInformationInteractor = async (
  applicationContext,
  { contactInfo, firmName, userId },
) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authenticatedUser, ROLE_PERMISSIONS.UPDATE_CONTACT_INFO) ||
    authenticatedUser.userId !== userId
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  try {
    await updateUserContactInformationHelper(applicationContext, {
      contactInfo,
      firmName,
      userId,
    });
  } catch (error) {
    applicationContext.logger.error(error);
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_update_error',
        error: error.toString(),
      },
      userId: authenticatedUser.userId,
    });
    throw error;
  }
};

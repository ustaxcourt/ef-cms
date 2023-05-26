import {
  Practitioner,
  entityName as practitionerEntityName,
} from '../../entities/Practitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';
import { generateChangeOfAddress } from './generateChangeOfAddress';
import { entityName as irsPractitionerEntityName } from '../../entities/IrsPractitioner';
import { isEqual } from 'lodash';
import { entityName as privatePractitionerEntityName } from '../../entities/PrivatePractitioner';
import { withLocking } from '../../useCaseHelper/acquireLock';

/**
 * updateUserContactInformationHelper
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.userId the userId to update the contact info
 * @param {string} providers.firmName firmName to update if a privatePractitioner is updating their info
 * @returns {Promise} an object is successful
 */
const updateUserContactInformationHelper = async (
  applicationContext: IApplicationContext,
  {
    contactInfo,
    firmName,
    userId,
  }: { contactInfo: any; firmName: string; userId: string },
) => {
  const user: any = await applicationContext
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
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.userId the userId to update the contact info
 */
export const updateUserContactInformation = async (
  applicationContext: IApplicationContext,
  {
    contactInfo,
    firmName,
    userId,
  }: { contactInfo: any; firmName: string; userId: string },
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

export const handleLockError = async (
  applicationContext: IApplicationContext,
  originalRequest: any,
) => {
  const user = applicationContext.getCurrentUser();

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'retry_async_request',
      originalRequest,
      requestToRetry: 'update_user_contact_information',
    },
    userId: user.userId,
  });
};

export const determineEntitiesToLock = async (
  applicationContext: IApplicationContext,
  { userId }: { userId: string },
) => {
  const docketNumbers: string[] = await applicationContext
    .getPersistenceGateway()
    .getCasesByUserId({
      applicationContext,
      userId,
    });

  return {
    identifiers: docketNumbers?.map(item => `case|${item}`),
    ttl: 900,
  };
};

export const updateUserContactInformationInteractor = withLocking(
  updateUserContactInformation,
  determineEntitiesToLock,
  handleLockError,
);

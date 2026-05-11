import {
  AuthUser,
  UnknownAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { generateChangeOfAddress } from './generateChangeOfAddress';
import { isArray, isEqual } from 'lodash';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import {
  asyncHandleLockError,
  withLocking,
} from '@web-api/persistence/postgres/utils/mutex';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { RawUser, UserContact } from '@shared/business/entities/User';
import { getUserByIdOnceAllUpdatesComplete } from '@web-api/persistence/postgres/users/getUserByIdOnceAllUpdatesComplete';
import { getDocketNumbersByUser } from '@web-api/persistence/postgres/users/getDocketNumbersByUser';

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
  applicationContext: ServerApplicationContext,
  {
    contactInfo,
    firmName,
    userId,
    clientConnectionId,
  }: {
    contactInfo: UserContact;
    firmName: string;
    userId: string;
    clientConnectionId: string;
  },
  authorizedUser: AuthUser,
) => {
  const oldUser = await getUserById({ userId });

  if (!oldUser) {
    throw new NotFoundError(`User not found with user id ${userId}`);
  }

  const isPractitioner = u => {
    return [
      ROLES.privatePractitioner,
      ROLES.irsPractitioner,
      ROLES.inactivePractitioner,
    ].includes(u.role);
  };

  const isPractitionerUnchanged = u =>
    isPractitioner(u) &&
    isEqual(oldUser.contact, contactInfo) &&
    isEqual(oldUser.firmName, firmName);

  const isUserUnchanged = u =>
    !isPractitioner(u) && isEqual(oldUser.contact, contactInfo);

  if (isPractitionerUnchanged(oldUser) || isUserUnchanged(oldUser)) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: { action: 'user_contact_initial_update_complete' },
      userId: oldUser.userId,
      clientConnectionId,
    });
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_full_update_complete',
        user: oldUser as RawUser,
      },
      userId: oldUser.userId,
      clientConnectionId,
    });
    return;
  }

  let updatedUserEntity;
  if (isPractitioner(oldUser)) {
    updatedUserEntity = new Practitioner({
      ...oldUser,
      contact: { ...contactInfo },
      isUpdatingInformation: true,
    });

    updatedUserEntity.firmName = firmName;
  } else {
    throw new Error(`Unrecognized role ${oldUser.role}`);
  }

  await upsertUsers([updatedUserEntity.validate().toRawObject()]);

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: { action: 'user_contact_initial_update_complete' },
    userId: oldUser.userId,
    clientConnectionId,
  });

  const results = await generateChangeOfAddress({
    applicationContext,
    authorizedUser,
    contactInfo,
    user: updatedUserEntity.validate().toRawObject(),
    oldUser: oldUser as RawUser,
    websocketMessagePrefix: 'user',
  });

  if (isArray(results) && !results.length) {
    updatedUserEntity.setIsUpdatingInformation(false);
    await upsertUsers([updatedUserEntity.validate().toRawObject()]);

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_full_update_complete',
        user: updatedUserEntity.validate().toRawObject(),
      },
      userId: oldUser.userId,
      clientConnectionId,
    });
  }
};

/**
 * updateUserContactInformationInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.userId the userId to update the contact info
 */
export const updateUserContactInformation = async (
  applicationContext: ServerApplicationContext,
  {
    contactInfo,
    firmName,
    userId,
    clientConnectionId,
  }: {
    contactInfo: UserContact;
    firmName: string;
    userId: string;
    clientConnectionId: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPDATE_CONTACT_INFO) ||
    authorizedUser?.userId !== userId
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  try {
    await updateUserContactInformationHelper(
      applicationContext,
      { contactInfo, firmName, userId, clientConnectionId },
      authorizedUser,
    );
  } catch (error) {
    applicationContext.logger.error(error);
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_update_error',
        error: (error as Error).toString(),
      },
      userId: authorizedUser.userId,
      clientConnectionId,
    });
    throw error;
  }
};

export const determineEntitiesToLock = async (
  _: ServerApplicationContext,
  { userId }: { userId: string },
) => {
  await getUserByIdOnceAllUpdatesComplete({ userId });

  const cases = await getDocketNumbersByUser({ userId });

  return {
    identifiers: cases?.map(docketNumber => `case|${docketNumber}`),
    ttl: 900,
  };
};

export const updateUserContactInformationInteractor = withLocking(
  updateUserContactInformation,
  determineEntitiesToLock,
  asyncHandleLockError,
);

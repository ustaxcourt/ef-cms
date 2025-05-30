import {
  AuthUser,
  UnknownAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { generateChangeOfAddress } from './generateChangeOfAddress';
import { isArray, isEqual } from 'lodash';
import {
  asyncHandleLockError,
  withLocking,
} from '@web-api/business/useCaseHelper/acquireLock';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { updateUser } from '@web-api/persistence/postgres/users/updateUser';
import { getUserByIdOnceAllUpdatesComplete } from '@web-api/persistence/postgres/users/getUserByIdOnceAllUpdatesComplete';
import { getPractitionerById } from '@web-api/persistence/postgres/practitioners/getPractitionerById';
import { updatePractitioner } from '@web-api/persistence/postgres/practitioners/updatePractitioner';
import { getCasesForUser } from '@web-api/persistence/postgres/users/cases/getCasesForUser';
import { settlePromises } from '@web-api/utilities/settlePromises';

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
    contactInfo: any;
    firmName: string;
    userId: string;
    clientConnectionId: string;
  },
  authorizedUser: AuthUser,
) => {
  const user = (await getPractitionerById({ userId })) as Practitioner;

  const isPractitioner = u => {
    return (
      u.entityName === PrivatePractitioner.ENTITY_NAME ||
      u.entityName === IrsPractitioner.ENTITY_NAME ||
      u.entityName === Practitioner.ENTITY_NAME
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
      message: { action: 'user_contact_initial_update_complete' },
      userId: user.userId,
      clientConnectionId,
    });
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: { action: 'user_contact_full_update_complete', user },
      userId: user.userId,
      clientConnectionId,
    });
    return;
  }

  let userEntity;
  if (
    user.entityName === PrivatePractitioner.ENTITY_NAME ||
    user.entityName === IrsPractitioner.ENTITY_NAME ||
    user.entityName === Practitioner.ENTITY_NAME
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

  await settlePromises([
    updatePractitioner({
      practitionerToUpdate: userEntity.validate().toRawObject(),
    }),
    updateUser({
      userToUpdate: userEntity.validate().toRawObject(),
    }),
  ]);

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: { action: 'user_contact_initial_update_complete' },
    userId: user.userId,
    clientConnectionId,
  });

  const results = await generateChangeOfAddress({
    applicationContext,
    authorizedUser,
    contactInfo,
    firmName,
    user: userEntity.validate().toRawObject(),
    websocketMessagePrefix: 'user',
  });

  if (isArray(results) && !results.length) {
    userEntity.setIsUpdatingInformation(false);
    await updateUser({
      userToUpdate: userEntity.validate().toRawObject(),
    });

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_full_update_complete',
        user: userEntity.validate().toRawObject(),
      },
      userId: user.userId,
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
    contactInfo: any;
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
  _applicationContext,
  { userId }: { userId: string },
) => {
  await getUserByIdOnceAllUpdatesComplete({ userId });

  const cases = await getCasesForUser({ userId });

  return {
    identifiers: cases?.map(item => `case|${item.docketNumber}`),
    ttl: 900,
  };
};

export const updateUserContactInformationInteractor = withLocking(
  updateUserContactInformation,
  determineEntitiesToLock,
  asyncHandleLockError,
);

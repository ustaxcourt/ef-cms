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
import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import { updateUser } from '@web-api/persistence/postgres/users/updateUser';
import { getUserByIdOnceAllUpdatesComplete } from '@web-api/persistence/postgres/users/getUserByIdOnceAllUpdatesComplete';
import { getPractitionerById } from '@web-api/persistence/postgres/practitioners/getPractitionerById';
import { getCasesForUser } from '@web-api/persistence/postgres/users/cases/getCasesForUser';
import {
  asyncHandleLockError,
  withLocking,
} from '@web-api/persistence/postgres/utils/mutex';

/**
 * updatePractitionerContactInformationHelper
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.userId the userId to update the contact info
 * @param {string} providers.firmName firmName to update if a privatePractitioner is updating their info
 * @returns {Promise} an object is successful
 */
const updatePractitionerContactInformationHelper = async (
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
  const practitioner = await getPractitionerById({ userId });

  if (!practitioner) {
    throw new NotFoundError(`User not found with userId: ${userId}`);
  }

  const isPractitionerUnchanged = user =>
    isEqual(user.contact, contactInfo) && isEqual(user.firmName, firmName);

  if (isPractitionerUnchanged(practitioner)) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: { action: 'user_contact_initial_update_complete' },
      userId: practitioner.userId,
      clientConnectionId,
    });
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_full_update_complete',
        user: practitioner.toRawObject() as RawPractitioner,
      },
      userId: practitioner.userId,
      clientConnectionId,
    });
    return;
  }

  const userEntity = new Practitioner({
    ...practitioner,
    contact: { ...contactInfo },
    isUpdatingInformation: true,
  });

  userEntity.firmName = firmName;

  await updateUser({
    userToUpdate: userEntity.validate().toRawObject(),
  });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: { action: 'user_contact_initial_update_complete' },
    userId: practitioner.userId,
    clientConnectionId,
  });

  // 10495 TODO: We should pass the old data (that is, the `user` variable set
  // at the top of this use case) to generateChangeOfAddress, instead of relying
  // on generateChangeOfAddress to fetch the old data, which doesn't exist on
  // disk anymore.
  const results = await generateChangeOfAddress({
    applicationContext,
    authorizedUser,
    contactInfo,
    firmName,
    user: userEntity.validate().toRawObject(),
    oldUser: practitioner.toRawObject(),
    websocketMessagePrefix: 'user',
  });

  if (isArray(results) && !results.length) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_full_update_complete',
        user: userEntity.validate().toRawObject(),
      },
      userId: practitioner.userId,
      clientConnectionId,
    });
  }

  userEntity.setIsUpdatingInformation(false);
  await updateUser({
    userToUpdate: userEntity.validate().toRawObject(),
  });
};

/**
 * updatePractitionerContactInformationInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.userId the userId to update the contact info
 */
export const updatePractitionerContactInformation = async (
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
    await updatePractitionerContactInformationHelper(
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

export const updatePractitionerContactInformationInteractor = withLocking(
  updatePractitionerContactInformation,
  determineEntitiesToLock,
  asyncHandleLockError,
);

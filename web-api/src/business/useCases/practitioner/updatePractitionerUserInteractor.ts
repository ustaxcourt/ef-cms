import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  Practitioner,
  RawPractitioner,
} from '../../../../../shared/src/business/entities/Practitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { generateChangeOfAddress } from '../../../../../shared/src/business/useCases/users/generateChangeOfAddress';
import { omit, union } from 'lodash';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

export const updatePractitionerUser = async (
  applicationContext: IApplicationContext,
  {
    barNumber,
    bypassDocketEntry = false,
    user,
  }: { barNumber: string; bypassDocketEntry?: boolean; user: RawPractitioner },
) => {
  const requestUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(requestUser, ROLE_PERMISSIONS.ADD_EDIT_PRACTITIONER_USER) ||
    !isAuthorized(requestUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)
  ) {
    throw new UnauthorizedError('Unauthorized for updating practitioner user');
  }

  const oldUser = await applicationContext
    .getPersistenceGateway()
    .getPractitionerByBarNumber({ applicationContext, barNumber });

  if (!oldUser) {
    throw new NotFoundError('Could not find user');
  }

  const userHasAccount = !!oldUser.email;
  const userIsUpdatingEmail = !!user.updatedEmail;

  if (oldUser.userId !== user.userId) {
    throw new Error('Bar number does not match user data.');
  }

  if (userHasAccount && userIsUpdatingEmail) {
    await updateUserPendingEmail({ applicationContext, user });
  }

  // do not allow edit of bar number
  const validatedUserData = new Practitioner(
    {
      ...user,
      barNumber: oldUser.barNumber,
      email: oldUser.email,
    },
    { applicationContext },
  )
    .validate()
    .toRawObject();

  let updatedUser = validatedUserData;

  if (oldUser.email || oldUser.pendingEmail) {
    updatedUser = await applicationContext
      .getPersistenceGateway()
      .updatePractitionerUser({
        applicationContext,
        user: validatedUserData,
      });
  } else if (!oldUser.email && user.updatedEmail) {
    updatedUser = await applicationContext
      .getPersistenceGateway()
      .createNewPractitionerUser({
        applicationContext,
        user: new Practitioner({
          ...validatedUserData,
          pendingEmail: user.updatedEmail,
        })
          .validate()
          .toRawObject(),
      });
  } else {
    await applicationContext.getPersistenceGateway().updateUserRecords({
      applicationContext,
      oldUser: new Practitioner(oldUser).validate().toRawObject(),
      updatedUser: validatedUserData,
      userId: oldUser.userId,
    });
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'admin_contact_initial_update_complete',
    },
    userId: requestUser.userId,
  });

  if (userHasAccount && userIsUpdatingEmail) {
    await applicationContext.getUseCaseHelpers().sendEmailVerificationLink({
      applicationContext,
      pendingEmail: user.pendingEmail,
      pendingEmailVerificationToken: user.pendingEmailVerificationToken,
    });
  }

  const updatedFields = getUpdatedFieldNames({
    applicationContext,
    oldUser,
    updatedUser,
  });

  const propertiesNotRequiringChangeOfAddress = [
    'pendingEmail',
    'pendingEmailVerificationToken',
    'practitionerNotes',
  ];
  const combinedDiffKeys = union(
    updatedFields,
    propertiesNotRequiringChangeOfAddress,
  );

  if (combinedDiffKeys.length > propertiesNotRequiringChangeOfAddress.length) {
    await generateChangeOfAddress({
      applicationContext,
      bypassDocketEntry,
      contactInfo: validatedUserData.contact,
      firmName: validatedUserData.firmName,
      requestUserId: requestUser.userId,
      updatedEmail: validatedUserData.email,
      updatedName: validatedUserData.name,
      user: oldUser,
      websocketMessagePrefix: 'admin',
    });
  } else {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'admin_contact_full_update_complete',
      },
      userId: requestUser.userId,
    });
  }
};

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

const getUpdatedFieldNames = ({ applicationContext, oldUser, updatedUser }) => {
  const updatedPractitionerRaw = new Practitioner(updatedUser, {
    applicationContext,
  }).toRawObject();
  const oldPractitionerRaw = new Practitioner(oldUser, {
    applicationContext,
  }).toRawObject();

  const practitionerDetailDiff = applicationContext
    .getUtilities()
    .getAddressPhoneDiff({
      newData: {
        ...omit(updatedPractitionerRaw, 'contact'),
        ...updatedPractitionerRaw.contact,
      },
      oldData: {
        ...omit(oldPractitionerRaw, 'contact'),
        ...oldPractitionerRaw.contact,
      },
    });

  return Object.keys(practitionerDetailDiff);
};

export const handleLockError = async (
  applicationContext: IApplicationContext,
  originalRequest: any,
) => {
  const user = applicationContext.getCurrentUser();

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId: originalRequest.clientConnectionId,
    message: {
      action: 'retry_async_request',
      originalRequest,
      requestToRetry: 'update_practitioner_user',
    },
    userId: user.userId,
  });
};

export const determineEntitiesToLock = async (
  applicationContext: IApplicationContext,
  { user }: { user: Practitioner },
) => {
  const docketNumbers: string[] = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({
      applicationContext,
      userId: user.userId,
    });

  return {
    identifiers: docketNumbers.map(item => `case|${item}`),
    ttl: 900,
  };
};

export const updatePractitionerUserInteractor = withLocking(
  updatePractitionerUser,
  determineEntitiesToLock,
  handleLockError,
);

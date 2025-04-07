import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { omit, union } from 'lodash';
import { updateUserPendingEmail } from '@web-api/business/useCases/user/updateUserPendingEmailInteractor';
import {
  asyncHandleLockError,
  withLocking,
} from '@web-api/business/useCaseHelper/acquireLock';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import {
  RawPractitioner,
  Practitioner,
} from '@shared/business/entities/Practitioner';
import { generateChangeOfAddress } from '@web-api/business/useCases/user/generateChangeOfAddress';
import { createNewPractitionerUser } from '@web-api/persistence/postgres/users/createNewPractitionerUser';
import { updateUser } from '@web-api/persistence/postgres/users/updateUser';
import { updatePractitionerUser as updatePractitionerUserFromPersistence } from '@web-api/persistence/postgres/users/updatePractitionerUser';
import { getPractitionerByBarNumber } from '@web-api/persistence/postgres/users/getPractitionerByBarNumber';

export const updatePractitionerUser = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    barNumber,
    bypassDocketEntry = false,
    user,
  }: {
    barNumber: string;
    bypassDocketEntry?: boolean;
    user: RawPractitioner;
    clientConnectionId: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (
    !isAuthorized(
      authorizedUser,
      ROLE_PERMISSIONS.ADD_EDIT_PRACTITIONER_USER,
    ) ||
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)
  ) {
    throw new UnauthorizedError('Unauthorized for updating practitioner user');
  }

  const oldUser = await getPractitionerByBarNumber({ barNumber });

  if (!oldUser) {
    throw new NotFoundError('Could not find user');
  }

  const userHasAccount = !!oldUser.email;
  const userIsUpdatingEmail = !!user.updatedEmail;

  if (oldUser.userId !== user.userId) {
    throw new Error('Bar number does not match user data.');
  }

  if (userHasAccount && userIsUpdatingEmail) {
    await updateUserPendingEmail({
      applicationContext,
      pendingEmail: user.updatedEmail!,
      user,
    });
  }

  // do not allow edit of bar number
  const validatedUserData = new Practitioner(
    {
      ...user,
      userId: oldUser.userId,
      barNumber: oldUser.barNumber,
      email: oldUser.email,
    },
    { applicationContext },
  )
    .validate()
    .toRawObject();

  let updatedUser = validatedUserData;

  if (oldUser.email || oldUser.pendingEmail) {
    updatedUser = await updatePractitionerUserFromPersistence({
      applicationContext,
      user: validatedUserData,
    });
  } else if (!oldUser.email && user.updatedEmail) {
    updatedUser = await createNewPractitionerUser({
      user: new Practitioner({
        ...validatedUserData,
        pendingEmail: user.updatedEmail,
      })
        .validate()
        .toRawObject(),
    });
  } else {
    await updateUser({ userToUpdate: validatedUserData });
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: { action: 'admin_contact_initial_update_complete' },
    userId: authorizedUser.userId,
    clientConnectionId,
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
    'pendingEmailVerificationTokenTimestamp',
    'practitionerNotes',
  ];
  const combinedDiffKeys = union(
    updatedFields,
    propertiesNotRequiringChangeOfAddress,
  );

  if (combinedDiffKeys.length > propertiesNotRequiringChangeOfAddress.length) {
    await generateChangeOfAddress({
      applicationContext,
      authorizedUser,
      bypassDocketEntry,
      contactInfo: validatedUserData.contact,
      firmName: validatedUserData.firmName,
      requestUserId: authorizedUser.userId,
      updatedEmail: validatedUserData.email,
      updatedName: validatedUserData.name,
      user: oldUser,
      websocketMessagePrefix: 'admin',
    });
  } else {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: { action: 'admin_contact_full_update_complete' },
      userId: authorizedUser.userId,
      clientConnectionId,
    });
  }
};

const getUpdatedFieldNames = ({
  applicationContext,
  oldUser,
  updatedUser,
}: {
  applicationContext: ServerApplicationContext;
  oldUser: any;
  updatedUser: any;
}) => {
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

export const determineEntitiesToLock = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: Practitioner },
) => {
  const docketNumbers: string[] = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({ applicationContext, userId: user.userId });

  return { identifiers: docketNumbers.map(item => `case|${item}`), ttl: 900 };
};

export const updatePractitionerUserInteractor = withLocking(
  updatePractitionerUser,
  determineEntitiesToLock,
  asyncHandleLockError,
);

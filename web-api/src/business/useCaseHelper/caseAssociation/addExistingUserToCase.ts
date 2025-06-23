import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { associateUserWithCase } from '@web-api/persistence/postgres/users/cases/associateUserWithCase';

export const addExistingUserToCase = async ({
  applicationContext,
  authorizedUser,
  caseEntity,
  contactId,
  email,
  name,
}: {
  applicationContext: ServerApplicationContext;
  caseEntity: Case;
  contactId: string;
  email: string;
  name: string;
  authorizedUser: AuthUser;
}): Promise<string> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_USER_TO_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email,
    });

  if (!user) {
    throw new Error(`no user found with the provided email of ${email}`);
  }

  const userToAdd = await getUserById({ userId: user.userId });

  if (!userToAdd) {
    throw new NotFoundError(`Could not find user ${user.userId}`);
  }

  const contact = caseEntity.getPetitionerById(contactId);

  caseEntity.privatePractitioners?.forEach(practitioner => {
    const representingArray = practitioner.representing;

    if (representingArray.includes(contact.contactId)) {
      const idx = representingArray.indexOf(contact.contactId);
      representingArray[idx] = userToAdd.userId;
    }
  });

  if (contact.name === name) {
    contact.contactId = userToAdd.userId;

    if (!userToAdd.pendingEmail) {
      contact.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
      contact.email = email;
      contact.hasElectronicAccess = true;
    }
  } else {
    throw new Error(`no contact found with that user name of ${name}`);
  }

  const rawCase = caseEntity.toRawObject();

  await associateUserWithCase({
    docketNumber: rawCase.docketNumber,
    userId: userToAdd.userId,
    entityName: userToAdd.entityName,
  });

  return userToAdd.userId;
};

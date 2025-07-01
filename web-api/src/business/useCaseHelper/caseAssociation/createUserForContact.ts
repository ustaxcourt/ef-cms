import { Case } from '@shared/business/entities/cases/Case';
import { ROLES } from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { createNewPetitionerUser } from '@web-api/persistence/postgres/users/createNewPetitionerUser';
import { upsertUserOnCaseRecords } from '@web-api/persistence/postgres/users/cases/upsertUserOnCaseRecords';

export const createUserForContact = async ({
  authorizedUser,
  caseEntity,
  contactId,
  email,
  name,
}: {
  applicationContext: ServerApplicationContext;
  authorizedUser: UnknownAuthUser;
  caseEntity: Case;
  contactId: string;
  email: string;
  name: string;
}): Promise<Case> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_USER_TO_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const contact = caseEntity.getPetitionerById(contactId);

  const userEntity = new User({
    contact,
    hasElectronicAccess: true,
    name,
    pendingEmail: email,
    role: ROLES.petitioner,
    userId: contactId,
  });

  const userRaw = userEntity.validate().toRawObject();

  await createNewPetitionerUser({
    userToCreate: userRaw,
  });

  const rawCase = caseEntity.toRawObject();

  await upsertUserOnCaseRecords([
    {
      docketNumber: rawCase.docketNumber,
      userId: userRaw.userId,
      serviceIndicator: contact.serviceIndicator,
    },
  ]);

  return caseEntity;
};

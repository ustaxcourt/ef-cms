import { Case } from '@shared/business/entities/cases/Case';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '../../../../../shared/src/business/entities/User';
import { UserCase } from '../../../../../shared/src/business/entities/UserCase';

export const createUserForContact = async ({
  applicationContext,
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
    hasEAccess: true,
    name,
    pendingEmail: email,
    role: ROLES.petitioner,
    userId: contactId,
  });

  const userRaw = userEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().createNewPetitionerUser({
    applicationContext,
    user: userRaw,
  });

  const rawCase = caseEntity.toRawObject();
  const userCaseEntity = new UserCase(rawCase);

  await applicationContext.getPersistenceGateway().associateUserWithCase({
    applicationContext,
    docketNumber: rawCase.docketNumber,
    userCase: userCaseEntity.validate().toRawObject(),
    userId: userRaw.userId,
  });

  return caseEntity;
};

import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { SERVICE_INDICATOR_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UserCase } from '../../../../../shared/src/business/entities/UserCase';

export const addExistingUserToCase = async ({
  applicationContext,
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
}): Promise<string> => {
  const authorizedUser = applicationContext.getCurrentUser();

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

  // 10007 bug here

  const userToAdd = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId: user.userId,
    });

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
      contact.hasEAccess = true;
    }
  } else {
    throw new Error(`no contact found with that user name of ${name}`);
  }

  const rawCase = caseEntity.toRawObject();
  const userCaseEntity = new UserCase(rawCase);

  await applicationContext.getPersistenceGateway().associateUserWithCase({
    applicationContext,
    docketNumber: rawCase.docketNumber,
    userCase: userCaseEntity.validate().toRawObject(),
    userId: userToAdd.userId,
  });

  return userToAdd.userId;
};

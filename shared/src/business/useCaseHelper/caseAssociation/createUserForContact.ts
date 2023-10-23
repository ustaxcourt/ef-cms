import { ROLES } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { User } from '../../entities/User';
import { UserCase } from '../../entities/UserCase';

/**
 * createUserForContact
 *
 * @param {object} options.contactId the id of the contact to create user for
 * @param {object} options.caseEntity the case entity to modify and return
 * @param {string} options.email the email address for the user we are attaching to the case
 * @param {string} options.name the name of the user to update the case with
 * @returns {Case} the updated case entity
 */
export const createUserForContact = async ({
  applicationContext,
  caseEntity,
  contactId,
  email,
  name,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

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

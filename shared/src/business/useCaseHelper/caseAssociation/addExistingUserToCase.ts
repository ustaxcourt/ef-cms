import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { SERVICE_INDICATOR_TYPES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UserCase } from '../../entities/UserCase';

/**
 * addExistingUserToCase
 *
 * @param {object} options the options object
 * @param {object} options.applicationContext the applicationContext
 * @param {object} options.caseEntity the case entity to modify and return
 * @param {string} options.contactId the contactId of the user to add to the case
 * @param {string} options.email the email address for the user we are attaching to the case
 * @param {string} options.name the name of the user to update the case with
 * @returns {string} the contactId of the cognito user who matches the provided email
 */
export const addExistingUserToCase = async ({
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

  const userIdFromCognito = await applicationContext
    .getPersistenceGateway()
    .getCognitoUserIdByEmail({
      applicationContext,
      email,
    });

  if (!userIdFromCognito) {
    throw new Error(`no user found with the provided email of ${email}`);
  }

  const userToAdd = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId: userIdFromCognito,
    });

  const contact = caseEntity.getPetitionerById(contactId);

  caseEntity.privatePractitioners.forEach(practitioner => {
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

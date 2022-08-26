import { createPractitionerUser } from '../../utilities/createPractitionerUser';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { Practitioner } from '../../entities/Practitioner';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * createPractitionerUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
export const createPractitionerUserInteractor = async (
  applicationContext: IApplicationContext,
  { user }: { user: TPractitioner },
) => {
  const requestUser = applicationContext.getCurrentUser();

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.ADD_EDIT_PRACTITIONER_USER)) {
    throw new UnauthorizedError('Unauthorized for creating practitioner user');
  }

  user.pendingEmail = user.email;
  user.email = undefined;

  const practitioner = await createPractitionerUser({
    applicationContext,
    user,
  });

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createOrUpdatePractitionerUser({
      applicationContext,
      user: practitioner,
    });

  return new Practitioner(createdUser, { applicationContext })
    .validate()
    .toRawObject();
};

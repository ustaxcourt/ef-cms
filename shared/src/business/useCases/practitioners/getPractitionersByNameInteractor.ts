import { MAX_SEARCH_RESULTS } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * getPractitionersByNameInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} params the params object
 * @param {string} params.name the name to search by
 * @returns {*} the result
 */
export const getPractitionersByNameInteractor = async (
  applicationContext: IApplicationContext,
  { name }: { name: string },
) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authenticatedUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)
  ) {
    throw new UnauthorizedError('Unauthorized for searching practitioners');
  }

  if (!name) {
    throw new Error('Name must be provided to search');
  }

  const foundUsers = (
    await applicationContext.getPersistenceGateway().getPractitionersByName({
      applicationContext,
      name,
    })
  ).slice(0, MAX_SEARCH_RESULTS);

  return foundUsers.map(foundUser => ({
    admissionsStatus: foundUser.admissionsStatus,
    barNumber: foundUser.barNumber,
    contact: {
      state: foundUser.contact.state,
    },
    name: foundUser.name,
  }));
};

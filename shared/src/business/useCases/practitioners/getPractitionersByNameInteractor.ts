import { MAX_SEARCH_RESULTS } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export const getPractitionersByNameInteractor = async (
  applicationContext: IApplicationContext,
  { name, searchAfter }: { name: string; searchAfter: string },
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

  const { lastKey, results, total } = await applicationContext
    .getPersistenceGateway()
    .getPractitionersByName({
      applicationContext,
      name,
      searchAfter,
    });

  // TODO do we need this line still if we're changing how we do pagination?
  const foundUsers = results.slice(0, MAX_SEARCH_RESULTS);

  const practitioners = foundUsers.map(foundUser => ({
    admissionsDate: foundUser.admissionsDate,
    admissionsStatus: foundUser.admissionsStatus,
    barNumber: foundUser.barNumber,
    contact: {
      state: foundUser.contact?.state,
    },
    name: foundUser.name,
    practiceType: foundUser.practiceType,
    practitionerType: foundUser.practitionerType,
  }));

  return { searchResults: { lastKey, practitioners, total } };
};

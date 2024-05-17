import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export type PractitionersByName = {
  searchResults: {
    lastKey: (string | number)[];
    practitioners: {
      admissionsDate: string;
      admissionsStatus: string;
      barNumber: string;
      contact: {
        state?: string;
      };
      name: string;
      practiceType: string;
      practitionerType: string;
    }[];
    total: number;
  };
};

export const getPractitionersByNameInteractor = async (
  applicationContext: IApplicationContext,
  { name, searchAfter }: { name: string; searchAfter: string },
): Promise<PractitionersByName> => {
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
    .getPractitionersByName(applicationContext, {
      name,
      searchAfter,
    });

  const practitioners = results.map(foundUser => ({
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
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  PublicContact,
  RawPublicContact,
} from '@shared/business/entities/cases/PublicContact';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export type PractitionerByNameParams = {
  name: string;
  searchAfter: string[];
  practitionerType?: string;
  practiceType?: string[];
  admissionStatus?: string[];
  originalBarState?: string[];
};

export type PractitionersByName = {
  searchResults: {
    lastKey: (string | number)[];
    practitioners: RawPublicContact[];
    total: number;
  };
};

export const getPractitionersByNameInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    name,
    searchAfter,
    practitionerType,
    practiceType,
    admissionStatus,
    originalBarState,
  }: PractitionerByNameParams,
  authorizedUser: UnknownAuthUser,
): Promise<PractitionersByName> => {
  const isLoggedInUser = !!authorizedUser?.userId;

  if (
    isLoggedInUser &&
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)
  ) {
    throw new UnauthorizedError('Unauthorized for searching practitioners');
  }

  if (!name) {
    throw new Error('Name must be provided to search');
  }

  const { lastKey, results, total } = await applicationContext
    .getPersistenceGateway()
    .getPractitionersByName(applicationContext, {
      admissionStatus,
      name,
      originalBarState,
      searchAfter,
      practiceType,
      practitionerType,
    });

  const practitioners = results.map(
    foundUser =>
      new PublicContact({
        ...foundUser,
        state: isLoggedInUser ? foundUser.contact?.state : undefined,
      }),
  );

  return {
    searchResults: {
      lastKey,
      practitioners,
      total,
    },
  };
};

import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { associatePrivatePractitionerToCase } from '../../useCaseHelper/caseAssociation/associatePrivatePractitionerToCase';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { type RawPractitioner } from '@shared/business/entities/Practitioner';

export const associatePrivatePractitionerWithCase = async (
  _applicationContext: ServerApplicationContext,
  {
    docketNumber,
    representing,
    serviceIndicator,
    userId,
  }: {
    docketNumber: string;
    representing: string[];
    serviceIndicator: string;
    userId: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<RawCase> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = (await getUserById({ userId })) as RawPractitioner;

  if (!user) {
    throw new Error(`Could not find a user for ${userId}`);
  }

  return await associatePrivatePractitionerToCase({
    authorizedUser,
    docketNumber,
    representing,
    serviceIndicator,
    user,
  });
};

export const associatePrivatePractitionerWithCaseInteractor = withLocking(
  associatePrivatePractitionerWithCase,
  (_applicationContext: ServerApplicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

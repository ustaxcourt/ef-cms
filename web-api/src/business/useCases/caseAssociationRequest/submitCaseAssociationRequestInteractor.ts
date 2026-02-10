import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { RawPractitioner } from '@shared/business/entities/Practitioner';

const submitCaseAssociationRequest = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    filers = [],
  }: {
    docketNumber: string;
    filers: string[];
  },
  authorizedUser: UnknownAuthUser,
): Promise<{ docketNumber: string } | undefined> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await getUserById({ userId: authorizedUser.userId });

  if (!user) {
    throw new NotFoundError(`Could not find user ${authorizedUser.userId}`);
  }

  const isPrivatePractitioner =
    authorizedUser.role === ROLES.privatePractitioner;
  const isIrsPractitioner = authorizedUser.role === ROLES.irsPractitioner;

  if (isPrivatePractitioner && filers) {
    await applicationContext
      .getUseCaseHelpers()
      .associatePrivatePractitionerToCase({
        authorizedUser,
        docketNumber,
        representing: filers,
        user: user as RawPractitioner,
      });

    return { docketNumber };
  }

  if (isIrsPractitioner) {
    await applicationContext
      .getUseCaseHelpers()
      .associateIrsPractitionerToCase({
        authorizedUser,
        docketNumber,
        user,
      });

    return { docketNumber };
  }
};

export const submitCaseAssociationRequestInteractor = withLocking(
  submitCaseAssociationRequest,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

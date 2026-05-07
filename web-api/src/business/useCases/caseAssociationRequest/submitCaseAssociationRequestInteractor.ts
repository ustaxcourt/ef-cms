import { ROLES } from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { RawPractitioner } from '@shared/business/entities/Practitioner';

/**
 * submitCaseAssociationRequestInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.filers the parties represented by the practitioner
 * @returns {Promise<void>} the promise of the case association request
 */
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
): Promise<void> => {
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

    return;
  }

  if (isIrsPractitioner) {
    await applicationContext
      .getUseCaseHelpers()
      .associateIrsPractitionerToCase({
        authorizedUser,
        docketNumber,
        user,
      });
  }
};

export const submitCaseAssociationRequestInteractor = withLocking(
  submitCaseAssociationRequest,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

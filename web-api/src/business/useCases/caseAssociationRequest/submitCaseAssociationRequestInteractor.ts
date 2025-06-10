import { ROLES } from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { getPractitionerById } from '@web-api/persistence/postgres/practitioners/getPractitionerById';

/**
 * submitCaseAssociationRequestInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {array}  providers.consolidatedCasesDocketNumbers a list of the docketNumbers on which to file the case association document
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.filers the parties represented by the practitioner
 * @returns {Promise<*>} the promise of the case association request
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
) => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await getPractitionerById({ userId: authorizedUser.userId });

  if (!user) {
    throw new NotFoundError(`Could not find user ${authorizedUser.userId}`);
  }

  const isPrivatePractitioner =
    authorizedUser.role === ROLES.privatePractitioner;
  const isIrsPractitioner = authorizedUser.role === ROLES.irsPractitioner;

  if (isPrivatePractitioner && filers) {
    return await applicationContext
      .getUseCaseHelpers()
      .associatePrivatePractitionerToCase({
        applicationContext,
        authorizedUser,
        docketNumber,
        representing: filers,
        user: user.toRawObject() as RawPractitioner,
      });
  } else if (isIrsPractitioner) {
    return await applicationContext
      .getUseCaseHelpers()
      .associateIrsPractitionerToCase({
        applicationContext,
        authorizedUser,
        docketNumber,
        user: user.toRawObject() as RawPractitioner,
      });
  }
};

export const submitCaseAssociationRequestInteractor = withLocking(
  submitCaseAssociationRequest,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

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
import { CaseFactory } from '@web-api/business/entities/cases/CaseFactory';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';

/**
 * submitCaseAssociationRequestInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {array}  providers.consolidatedCasesDocketNumbers a list of the docketNumbers on which to file the case association document
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.filers the parties represented by the practitioner
 * @returns {Promise<CaseDTO | PublicCaseDTO | RestrictedCaseDTO>} the promise of the case association request
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
): Promise<CaseDTO | PublicCaseDTO | RestrictedCaseDTO | undefined> => {
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
    const theCase = await applicationContext
      .getUseCaseHelpers()
      .associatePrivatePractitionerToCase({
        authorizedUser,
        docketNumber,
        representing: filers,
        user: user as RawPractitioner,
      });

    return CaseFactory.getCaseDTO({
      rawCase: theCase,
      user: authorizedUser,
    });
  }

  if (isIrsPractitioner) {
    const theCase = await applicationContext
      .getUseCaseHelpers()
      .associateIrsPractitionerToCase({
        authorizedUser,
        docketNumber,
        user,
      });

    return CaseFactory.getCaseDTO({
      rawCase: theCase,
      user: authorizedUser,
    });
  }
};

export const submitCaseAssociationRequestInteractor = withLocking(
  submitCaseAssociationRequest,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

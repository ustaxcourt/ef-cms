import { ROLES } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 * submitCaseAssociationRequestInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {array}  providers.consolidatedCasesDocketNumbers a list of the docketNumbers on which to file the case association document
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.filers the parties represented by the practitioner
 * @returns {Promise<*>} the promise of the case association request
 */
export const submitCaseAssociationRequest = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    filers = [],
  }: {
    docketNumber: string;
    filers: string[];
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const isPrivatePractitioner =
    authorizedUser.role === ROLES.privatePractitioner;
  const isIrsPractitioner = authorizedUser.role === ROLES.irsPractitioner;

  if (isPrivatePractitioner && filers) {
    return await applicationContext
      .getUseCaseHelpers()
      .associatePrivatePractitionerToCase({
        applicationContext,
        docketNumber,
        representing: filers,
        user,
      });
  } else if (isIrsPractitioner) {
    return await applicationContext
      .getUseCaseHelpers()
      .associateIrsPractitionerToCase({
        applicationContext,
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

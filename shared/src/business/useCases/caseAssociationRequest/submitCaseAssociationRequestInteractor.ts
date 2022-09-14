import { associateIrsPractitionerToCase } from '../../useCaseHelper/caseAssociation/associateIrsPractitionerToCase';
import { associatePrivatePractitionerToCase } from '../../useCaseHelper/caseAssociation/associatePrivatePractitionerToCase';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { ROLES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * submitCaseAssociationRequestInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.representingPrimary true if the user is representing
 * the primary contact on the case, false otherwise
 * @param {string} providers.representingSecondary true if the user is representing
 * the secondary contact on the case, false otherwise
 * @returns {Promise<*>} the promise of the case association request
 */
export const submitCaseAssociationRequestInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber, filers }: { docketNumber: string; filers: string[] },
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

  if (isPrivatePractitioner) {
    return await associatePrivatePractitionerToCase({
      applicationContext,
      docketNumber,
      representing: filers,
      user,
    });
  } else if (isIrsPractitioner) {
    return await associateIrsPractitionerToCase({
      applicationContext,
      docketNumber,
      user,
    });
  }
};

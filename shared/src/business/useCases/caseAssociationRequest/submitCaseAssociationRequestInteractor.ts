import { ROLES } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
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
  {
    consolidatedCasesDocketNumbers,
    docketNumber,
    filers,
  }: {
    consolidatedCasesDocketNumbers?: string[];
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

  if (isPrivatePractitioner) {
    return await applicationContext
      .getUseCaseHelpers()
      .associatePrivatePractitionerToCase({
        applicationContext,
        consolidatedCasesDocketNumbers,
        docketNumber,
        representing: filers,
        user,
      });
  } else if (isIrsPractitioner) {
    return await applicationContext
      .getUseCaseHelpers()
      .associateIrsPractitionerToCase({
        applicationContext,
        consolidatedCasesDocketNumbers,
        docketNumber,
        user,
      });
  }
};

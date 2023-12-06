import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { associateIrsPractitionerToCase } from '../../useCaseHelper/caseAssociation/associateIrsPractitionerToCase';

/**
 * associateIrsPractitionerWithCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} params the params object
 * @param {string} params.docketNumber the case docket number
 * @param {string} params.serviceIndicator the type of service the irsPractitioner should receive
 * @param {string} params.userId the user id
 * @returns {*} the result
 */
export const associateIrsPractitionerWithCaseInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    serviceIndicator,
    userId,
  }: { docketNumber: string; serviceIndicator: string; userId: string },
) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authenticatedUser, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  return await associateIrsPractitionerToCase({
    applicationContext,
    docketNumber,
    serviceIndicator,
    user,
  });
};

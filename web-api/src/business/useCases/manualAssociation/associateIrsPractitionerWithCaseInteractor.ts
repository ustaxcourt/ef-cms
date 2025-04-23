import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { associateIrsPractitionerToCase } from '@web-api/business/useCaseHelper/caseAssociation/associateIrsPractitionerToCase';
import { getPractitionerById } from '@web-api/persistence/postgres/practitioners/getPractitionerById';

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
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    serviceIndicator,
    userId,
  }: { docketNumber: string; serviceIndicator: string; userId: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawCase> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const irsPractitioner = await getPractitionerById({ userId });

  return await associateIrsPractitionerToCase({
    applicationContext,
    authorizedUser,
    docketNumber,
    serviceIndicator,
    irsPractitioner,
  });
};

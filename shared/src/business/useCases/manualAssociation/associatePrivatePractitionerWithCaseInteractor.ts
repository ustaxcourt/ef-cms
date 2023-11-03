import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { associatePrivatePractitionerToCase } from '../../useCaseHelper/caseAssociation/associatePrivatePractitionerToCase';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 * associatePrivatePractitionerWithCaseInteractor
 * @param {object} applicationContext the application context
 * @param {object} params the params object
 * @param {string} params.docketNumber the docket number of the case
 * @param {Array} params.representing the contact ids the private practitioner is representing
 * @param {boolean} params.serviceIndicator serviceIndicator for the practitioner
 * @param {string} params.userId the user id
 * @returns {*} the result
 */
export const associatePrivatePractitionerWithCase = async (
  applicationContext: IApplicationContext,
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

  return await associatePrivatePractitionerToCase({
    applicationContext,
    docketNumber,
    representing,
    serviceIndicator,
    user,
  });
};

export const associatePrivatePractitionerWithCaseInteractor = withLocking(
  associatePrivatePractitionerWithCase,
  (_applicationContext: IApplicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

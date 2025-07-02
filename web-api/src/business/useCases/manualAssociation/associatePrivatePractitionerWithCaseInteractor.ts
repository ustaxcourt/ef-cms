import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { associatePrivatePractitionerToCase } from '../../useCaseHelper/caseAssociation/associatePrivatePractitionerToCase';
import { getPractitionerById } from '@web-api/persistence/postgres/practitioners/getPractitionerById';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

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
  _applicationContext: ServerApplicationContext,
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
  authorizedUser: UnknownAuthUser,
): Promise<RawCase> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const privatePractitioner = await getPractitionerById({ userId });

  if (!privatePractitioner) {
    throw new Error(`user not found with userId of ${userId}`);
  }

  return await associatePrivatePractitionerToCase({
    authorizedUser,
    docketNumber,
    representing,
    serviceIndicator,
    user: privatePractitioner.toRawObject() as RawPractitioner,
  });
};

export const associatePrivatePractitionerWithCaseInteractor = withLocking(
  associatePrivatePractitionerWithCase,
  (_applicationContext: ServerApplicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

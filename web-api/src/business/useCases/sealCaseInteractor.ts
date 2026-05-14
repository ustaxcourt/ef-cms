import { Case } from '@shared/business/entities/cases/Case';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

/**
 * sealCase
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @returns {Promise<object>} the updated case data
 */
export const sealCase = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SEAL_CASE)) {
    throw new UnauthorizedError('Unauthorized for sealing cases');
  }

  const rawCaseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseToUpdate = new Case(rawCaseToUpdate, { authorizedUser });

  caseToUpdate.setAsSealed();

  const validatedCase = caseToUpdate.validate().toRawObject();

  await upsertCases([validatedCase]);

  await applicationContext
    .getDispatchers()
    .sendNotificationOfSealing(applicationContext, { docketNumber });
};

export const sealCaseInteractor = withLocking(
  sealCase,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

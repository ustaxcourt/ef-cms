import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
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
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SEAL_CASE)) {
    throw new UnauthorizedError('Unauthorized for sealing cases');
  }

  const rawCaseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseToUpdate = new Case(rawCaseToUpdate, { authorizedUser });

  caseToUpdate.setAsSealed();

  const updatedCase = await updateCaseAndAssociations({
      authorizedUser,
      caseToUpdate,
    });

  await applicationContext
    .getDispatchers()
    .sendNotificationOfSealing(applicationContext, { docketNumber });

  return CaseFactory.getFullCase({ rawCase: updatedCase, user: authorizedUser })
    .validate()
    .toRawObject();
};

export const sealCaseInteractor = withLocking(
  sealCase,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

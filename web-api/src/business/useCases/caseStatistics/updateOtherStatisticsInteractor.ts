import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

/**
 * updateOtherStatistics
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update statistics
 * @param {number} providers.damages damages statistic to add to the case
 * @param {number} providers.litigationCosts litigation costs statistic to add to the case
 * @returns {object} the updated case
 */
export const updateOtherStatistics = async (
  _applicationContext: ServerApplicationContext,
  {
    damages,
    docketNumber,
    litigationCosts,
  }: { damages: number; docketNumber: string; litigationCosts: number },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_EDIT_STATISTICS)) {
    throw new UnauthorizedError('Unauthorized for editing statistics');
  }

  const oldCase = await getCaseByDocketNumber({
    docketNumber,
  });

  const newCase = new Case(
    { ...oldCase, damages, litigationCosts },
    { authorizedUser },
  );

  const updatedCase = await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: newCase,
  });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const updateOtherStatisticsInteractor = withLocking(
  updateOtherStatistics,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

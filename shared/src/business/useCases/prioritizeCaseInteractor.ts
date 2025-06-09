import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

/**
 * used for setting a case as high priority
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.reason the reason the case is being set as high priority
 * @param {string} providers.docketNumber the docket number of the case to set as high priority
 * @returns {object} the case data
 */
export const prioritizeCase = async (
  _applicationContext: ServerApplicationContext,
  { docketNumber, reason }: { docketNumber: string; reason: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawCase> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PRIORITIZE_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  if (caseEntity.isCalendared()) {
    throw new Error('Cannot set a calendared case as high priority');
  }
  if (caseEntity.blocked === true) {
    throw new Error('Cannot set a blocked case as high priority');
  }

  caseEntity.setAsHighPriority(reason);

  const updatedCase = await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const prioritizeCaseInteractor = withLocking(
  prioritizeCase,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

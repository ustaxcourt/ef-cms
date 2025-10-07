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
 * used for setting a date to indicate when a motr was granted
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.timestamp timestamp when the motr was granted
 * @param {string} providers.docketNumber the docket number
 * @returns {object} the case data
 */
export const editRemoteStatus = async (
  _applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EDIT_DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  // caseEntity.setRemoteGrantedDate(timestamp);

  const updatedCase = await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const editRemoteStatusInteractor = withLocking(
  editRemoteStatus,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

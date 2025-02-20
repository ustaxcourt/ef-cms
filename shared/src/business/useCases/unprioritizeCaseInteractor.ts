import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { applicationContext, ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { deleteCaseTrialSortMappingRecords } from '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords';
import { createCaseTrialSortMappingRecords } from '@web-api/persistence/dynamo/cases/createCaseTrialSortMappingRecords';
import { updateCaseAutomaticBlock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { getCaseByDocketNumber } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

/**
 * used for removing the high priority from a case
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to unprioritize
 * @returns {object} the case data
 */
export const unprioritizeCase = async (
  _applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PRIORITIZE_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  let caseEntity = new Case(caseToUpdate, { authorizedUser });

  caseEntity.unsetAsHighPriority();

  caseEntity = await updateCaseAutomaticBlock({
    applicationContext,
    caseEntity,
  });

  if (caseEntity.isReadyForTrial()) {
    await createCaseTrialSortMappingRecords({
      applicationContext,
      caseSortTags: caseEntity.generateTrialSortTags(),
      docketNumber: caseEntity.docketNumber,
    });
  } else {
    await deleteCaseTrialSortMappingRecords({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
    });
  }

  const updatedCase = await updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const unprioritizeCaseInteractor = withLocking(
  unprioritizeCase,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

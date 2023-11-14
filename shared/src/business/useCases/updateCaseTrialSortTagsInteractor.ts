import { Case } from '../entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';

/**
 * updates the case trial sort tags
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update the case trial sort tags
 */
export const updateCaseTrialSortTagsInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  const user = applicationContext.getCurrentUser();

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (caseEntity.isReadyForTrial()) {
    await applicationContext
      .getPersistenceGateway()
      .createCaseTrialSortMappingRecords({
        applicationContext,
        caseSortTags: caseEntity.generateTrialSortTags(),
        docketNumber: caseEntity.validate().toRawObject().docketNumber,
      });
  }
};

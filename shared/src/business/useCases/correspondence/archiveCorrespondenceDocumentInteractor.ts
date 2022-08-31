import { Case } from '../../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * archiveCorrespondenceDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.correspondenceId case correspondence id
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {void}
 */
export const archiveCorrespondenceDocumentInteractor = async (
  applicationContext: IApplicationContext,
  {
    correspondenceId,
    docketNumber,
  }: { correspondenceId: string; docketNumber: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await applicationContext.getPersistenceGateway().deleteDocumentFromS3({
    applicationContext,
    key: correspondenceId,
  });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const caseEntity = new Case(caseToUpdate, { applicationContext });
  const correspondenceToArchive = caseEntity.correspondence.find(
    c => c.correspondenceId === correspondenceId,
  );

  caseEntity.archiveCorrespondence(correspondenceToArchive, {
    applicationContext,
  });

  await applicationContext.getPersistenceGateway().updateCaseCorrespondence({
    applicationContext,
    correspondence: correspondenceToArchive,
    docketNumber,
  });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });
};

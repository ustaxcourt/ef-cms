import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { Case } from '../entities/cases/Case';
import { ServiceUnavailableError } from '../../errors/errors';
import { acquireLock } from '../useCaseHelper/acquireLock';
import { createISODateString } from '../utilities/DateHandler';

/**
 * @param {object} applicationContext the application context
 */
export const checkForReadyForTrialCasesInteractor = async (
  applicationContext: IApplicationContext,
) => {
  applicationContext.logger.debug('Time', createISODateString());

  const caseCatalog = await applicationContext
    .getPersistenceGateway()
    .getReadyForTrialCases({ applicationContext });

  const updateForTrial = async entity => {
    // assuming we want these done serially; if first fails, promise is rejected and error thrown
    const caseEntity = entity.validate();
    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

    if (caseEntity.isReadyForTrial()) {
      await applicationContext
        .getPersistenceGateway()
        .createCaseTrialSortMappingRecords({
          applicationContext,
          caseSortTags: caseEntity.generateTrialSortTags(),
          docketNumber: caseEntity.docketNumber,
        });
    }
  };

  const acquireLockForCase = async ({
    docketNumber,
    retry = 0,
  }: {
    docketNumber: string;
    retry?: number;
  }) => {
    const maxRetries = 20;
    try {
      await acquireLock({
        applicationContext,
        identifiers: [`case|${docketNumber}`],
        onLockError: new ServiceUnavailableError(
          `${docketNumber} is currently being updated`,
        ),
        ttl: 900,
      });
    } catch (err) {
      if (retry < maxRetries && err instanceof ServiceUnavailableError) {
        await applicationContext.getUtilities().sleep(5000);
        return acquireLockForCase({
          docketNumber,
          retry: retry + 1,
        });
      }
      throw err;
    }
  };

  const checkReadyForTrial = async caseRecord => {
    const { docketNumber } = caseRecord;
    await acquireLockForCase({ docketNumber });

    const caseToCheck = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    if (caseToCheck) {
      const caseEntity = new Case(caseToCheck, { applicationContext });
      if (caseEntity.status === CASE_STATUS_TYPES.generalDocket) {
        caseEntity.checkForReadyForTrial();
        if (
          caseEntity.status === CASE_STATUS_TYPES.generalDocketReadyForTrial
        ) {
          await updateForTrial(caseEntity);
        }
      }
    }
    await applicationContext.getPersistenceGateway().removeLock({
      applicationContext,
      identifiers: [`case|${docketNumber}`],
    });
  };

  const updatedCases = caseCatalog.map(checkReadyForTrial);

  await Promise.all(updatedCases);

  applicationContext.logger.debug('Time', createISODateString());
};

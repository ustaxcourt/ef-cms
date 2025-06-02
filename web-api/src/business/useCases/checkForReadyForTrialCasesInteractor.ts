import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { getReadyForTrialCases } from '@web-api/persistence/postgres/cases/reports/getReadyForTrialCases';
import { uniqBy } from 'lodash';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { acquireLock } from '@web-api/persistence/postgres/utils/mutex';

export const checkForReadyForTrialCasesInteractor = async (
  applicationContext: ServerApplicationContext,
) => {
  applicationContext.logger.debug('Time', createISODateString());

  const docketNumbers: { docketNumber: string }[] =
    await getReadyForTrialCases();

  const caseCatalogDocketNumbers = uniqBy(docketNumbers, 'docketNumber').map(
    caseRecord => caseRecord.docketNumber,
  );

  const updateForTrial = async entity => {
    // assuming we want these done serially; if first fails, promise is rejected and error thrown
    const caseEntity = entity.validate();
    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      authorizedUser: undefined,
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
        authorizedUser: undefined,
        identifiers: [`case|${docketNumber}`],
        onLockError: new ServiceUnavailableError(
          `${docketNumber} is currently being updated`,
        ),
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

  const checkReadyForTrial = async (
    caseRecord: Omit<RawCase, 'consolidatedCases'>,
  ) => {
    const { docketNumber } = caseRecord;
    await acquireLockForCase({ docketNumber });

    const removeLockFunction = await acquireLock({
      applicationContext,
      authorizedUser: undefined,
      identifiers: [`case|${docketNumber}`],
      retries: 20,
      waitTime: 5000,
    });

    if (caseRecord) {
      const caseEntity = new Case(caseRecord, {
        authorizedUser: undefined,
      });
      if (caseEntity.status === CASE_STATUS_TYPES.generalDocket) {
        caseEntity.checkForReadyForTrial();
        if (
          // @ts-ignore this can get updated in caseEntity.checkForReadyForTrial
          caseEntity.status === CASE_STATUS_TYPES.generalDocketReadyForTrial
        ) {
          await updateForTrial(caseEntity);
        }
      }
    }

    await removeLockFunction();
  };

  const casesToUpdate = await getCasesByDocketNumbers({
    docketNumbers: caseCatalogDocketNumbers,
  });

  await settlePromises(casesToUpdate.map(aCase => checkReadyForTrial(aCase)));

  applicationContext.logger.debug('Time', createISODateString());
};

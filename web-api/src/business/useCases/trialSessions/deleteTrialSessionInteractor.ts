import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { acquireLock } from '@web-api/business/useCaseHelper/acquireLock';

/**
 * deleteTrialSession
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the id of the trial session
 * @returns {Promise} the promise of the deleteTrialSession call
 */
export const deleteTrialSessionInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  if (
    trialSessionEntity.startDate <
    applicationContext.getUtilities().createISODateString()
  ) {
    throw new Error('Trial session cannot be updated after its start date');
  }

  if (trialSessionEntity.isCalendared) {
    throw new Error('Trial session cannot be deleted after it is calendared');
  }

  if (trialSessionEntity.caseOrder) {
    const docketNumbers = trialSessionEntity.caseOrder.map(
      ({ docketNumber }) => docketNumber,
    );

    await acquireLock({
      applicationContext,
      identifiers: docketNumbers?.map(item => `case|${item}`),
    });

    for (const order of trialSessionEntity.caseOrder) {
      const myCase = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber: order.docketNumber,
        });

      const caseEntity = new Case(myCase, { applicationContext });

      caseEntity.removeFromTrial({});

      if (caseEntity.isReadyForTrial()) {
        await applicationContext
          .getPersistenceGateway()
          .createCaseTrialSortMappingRecords({
            applicationContext,
            caseSortTags: caseEntity.generateTrialSortTags(),
            docketNumber: caseEntity.docketNumber,
          });
      }

      await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        caseToUpdate: caseEntity,
      });
    }

    await Promise.all(
      docketNumbers.map(docketNumber =>
        applicationContext.getPersistenceGateway().removeLock({
          applicationContext,
          identifiers: [`case|${docketNumber}`],
        }),
      ),
    );
  }

  await applicationContext.getPersistenceGateway().deleteTrialSession({
    applicationContext,
    trialSessionId,
  });

  if (trialSessionEntity.judge) {
    await applicationContext
      .getPersistenceGateway()
      .deleteTrialSessionWorkingCopy({
        applicationContext,
        trialSessionId,
        userId: trialSessionEntity.judge.userId,
      });
  }
  return trialSessionEntity.toRawObject();
};

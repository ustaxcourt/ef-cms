import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { acquireLock } from '@web-api/persistence/postgres/utils/mutex';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { deleteTrialSession } from '@web-api/persistence/postgres/trialSessions/deleteTrialSession';
import { deleteTrialSessionWorkingCopy } from '@web-api/persistence/postgres/trialSessions/deleteTrialSessionWorkingCopy';
import { withTransaction } from '@web-api/persistence/postgres/utils/transactions';

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
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const trialSessionEntity = new TrialSession(trialSession);

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

    const removeLockFunction = await acquireLock({
      applicationContext,
      authorizedUser,
      identifiers: docketNumbers?.map(item => `case|${item}`),
    });

    try {
      await withTransaction(async () => {
        const casesToUpdate = await getCasesByDocketNumbers({ docketNumbers });

        for (const myCase of casesToUpdate) {
          const caseEntity = new Case(myCase, { authorizedUser });

          caseEntity.removeFromTrial({});

          await updateCaseAndAssociations({
            authorizedUser,
            caseToUpdate: caseEntity,
          });
        }

        if (trialSessionEntity.judge) {
          await deleteTrialSessionWorkingCopy({
            trialSessionId,
            userId: trialSessionEntity.judge.userId,
          });
        }

        await deleteTrialSession({
          trialSessionId,
        });
      });
    } finally {
      await removeLockFunction();
    }
  } else {
    // No cases to remove, just delete the trial session
    await withTransaction(async () => {
      if (trialSessionEntity.judge) {
        await deleteTrialSessionWorkingCopy({
          trialSessionId,
          userId: trialSessionEntity.judge.userId,
        });
      }

      await deleteTrialSession({
        trialSessionId,
      });
    });
  }

  return trialSessionEntity.toRawObject();
};

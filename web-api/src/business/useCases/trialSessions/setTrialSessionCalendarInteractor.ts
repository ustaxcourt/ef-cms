import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TRIAL_SESSION_ELIGIBLE_CASES_BUFFER } from '../../../../../shared/src/business/entities/EntityConstants';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { acquireLock } from '@web-api/business/useCaseHelper/acquireLock';
import { chunk, flatten, partition, uniq } from 'lodash';

const CHUNK_SIZE = 50;

export const setTrialSessionCalendarInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    trialSessionId,
  }: { trialSessionId: string; clientConnectionId: string },
): Promise<void> => {
  const user = applicationContext.getCurrentUser();

  try {
    if (!isAuthorized(user, ROLE_PERMISSIONS.SET_TRIAL_SESSION_CALENDAR)) {
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

    trialSessionEntity.validate();

    trialSessionEntity.setAsCalendared();

    //get cases that have been manually added so we can set them as calendared
    const manuallyAddedCases = await applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession({
        applicationContext,
        trialSessionId,
      });

    // these cases are already on the caseOrder, so if they have not been QCed we have to remove them
    const [manuallyAddedQcCompleteCases, manuallyAddedQcIncompleteCases] =
      partition(
        manuallyAddedCases,
        manualCase =>
          manualCase.qcCompleteForTrial &&
          manualCase.qcCompleteForTrial[trialSessionId] === true,
      );

    let eligibleCasesLimit =
      (trialSessionEntity?.maxCases || 0) + TRIAL_SESSION_ELIGIBLE_CASES_BUFFER;

    eligibleCasesLimit -= manuallyAddedQcCompleteCases.length;

    const eligibleCases = (
      await applicationContext
        .getPersistenceGateway()
        .getEligibleCasesForTrialSession({
          applicationContext,
          limit: eligibleCasesLimit,
          skPrefix: trialSessionEntity.generateSortKeyPrefix(),
        })
    )
      .filter(
        eligibleCase =>
          eligibleCase.qcCompleteForTrial &&
          eligibleCase.qcCompleteForTrial[trialSessionId] === true,
      )
      .splice(
        0,
        (trialSessionEntity?.maxCases || 0) -
          manuallyAddedQcCompleteCases.length,
      );

    const allDocketNumbers = uniq(
      flatten([
        eligibleCases.map(({ docketNumber }) => docketNumber),
        manuallyAddedQcCompleteCases.map(({ docketNumber }) => docketNumber),
        manuallyAddedQcIncompleteCases.map(({ docketNumber }) => docketNumber),
      ]),
    );

    await acquireLock({
      applicationContext,
      identifiers: allDocketNumbers.map(item => `case|${item}`),
      ttl: 900,
    });

    const funcs = [
      ...manuallyAddedQcIncompleteCases.map(
        caseRecord => () =>
          removeManuallyAddedCaseFromTrialSession({
            applicationContext,
            caseRecord,
            trialSessionEntity,
          }),
      ),
      ...manuallyAddedQcCompleteCases.map(
        aCase => () =>
          setManuallyAddedCaseAsCalendared({
            applicationContext,
            caseRecord: aCase,
            trialSessionEntity,
          }),
      ),
      ...eligibleCases.map(
        aCase => () =>
          setTrialSessionCalendarForEligibleCase({
            applicationContext,
            caseRecord: aCase,
            trialSessionEntity,
          }),
      ),
    ];

    // Story: 10422
    // We chunk this array of functions so that we don't fire all of them at once.
    // If firing all at once, we exhaust the available connections and will run into connection timeouts.
    const chunkedFunctions = chunk(funcs, CHUNK_SIZE);
    for (let singleChunk of chunkedFunctions) {
      await Promise.all(singleChunk.map(func => func()));
    }

    await Promise.all(
      allDocketNumbers.map(docketNumber =>
        applicationContext.getPersistenceGateway().removeLock({
          applicationContext,
          identifiers: [`case|${docketNumber}`],
        }),
      ),
    );

    await applicationContext.getPersistenceGateway().updateTrialSession({
      applicationContext,
      trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
    });

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'set_trial_session_calendar_complete',
        trialSessionId,
      },
      userId: user.userId,
    });
  } catch (error: any) {
    applicationContext.logger.error(
      `Error setting trial session calendar for trialSessionId: ${trialSessionId}`,
    );
    applicationContext.logger.error(error);
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'set_trial_session_calendar_error',
        message: `Error setting trial session calendar: ${error?.message}`,
      },
      userId: user.userId,
    });
  }
};

const removeManuallyAddedCaseFromTrialSession = ({
  applicationContext,
  caseRecord,
  trialSessionEntity,
}: {
  applicationContext: ServerApplicationContext;
  caseRecord: RawCase;
  trialSessionEntity: TrialSession;
}): Promise<RawCase> => {
  trialSessionEntity.deleteCaseFromCalendar({
    docketNumber: caseRecord.docketNumber,
  });

  const caseEntity = new Case(caseRecord, { applicationContext });

  caseEntity.removeFromTrialWithAssociatedJudge();

  return applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });
};

const setManuallyAddedCaseAsCalendared = async ({
  applicationContext,
  caseRecord,
  trialSessionEntity,
}: {
  applicationContext: ServerApplicationContext;
  caseRecord: RawCase;
  trialSessionEntity: TrialSession;
}): Promise<void> => {
  const caseEntity = new Case(caseRecord, { applicationContext });

  caseEntity.setAsCalendared(trialSessionEntity);

  await Promise.all([
    applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
      highPriority: true,
      trialDate: caseEntity.trialDate,
    }),
    applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    }),
  ]);
};

const setTrialSessionCalendarForEligibleCase = async ({
  applicationContext,
  caseRecord,
  trialSessionEntity,
}: {
  applicationContext: ServerApplicationContext;
  caseRecord: RawCase;
  trialSessionEntity: TrialSession;
}): Promise<void> => {
  const caseEntity = new Case(caseRecord, { applicationContext });

  caseEntity.setAsCalendared(trialSessionEntity);
  trialSessionEntity.addCaseToCalendar(caseEntity);

  await Promise.all([
    applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
      highPriority: true,
      trialDate: caseEntity.trialDate,
    }),
    applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    }),
    applicationContext
      .getPersistenceGateway()
      .deleteCaseTrialSortMappingRecords({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
      }),
  ]);
};

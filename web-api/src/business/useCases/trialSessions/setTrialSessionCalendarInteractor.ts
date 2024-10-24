import {
  AuthUser,
  UnknownAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
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
import { flatten, partition, uniq } from 'lodash';
import PQueue from 'p-queue';

const CHUNK_SIZE = 50;

export const setTrialSessionCalendarInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    trialSessionId,
  }: { trialSessionId: string; clientConnectionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  try {
    if (
      !isAuthorized(authorizedUser, ROLE_PERMISSIONS.SET_TRIAL_SESSION_CALENDAR)
    ) {
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

    const trialSessionEntity = new TrialSession(trialSession);

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
      authorizedUser,
      identifiers: allDocketNumbers.map(item => `case|${item}`),
      ttl: 900,
    });

    const funcs = [
      ...manuallyAddedQcIncompleteCases.map(
        caseRecord => () =>
          removeManuallyAddedCaseFromTrialSession(
            {
              applicationContext,
              caseRecord,
              trialSessionEntity,
            },
            authorizedUser,
          ) as unknown as Promise<void>,
      ),
      ...manuallyAddedQcCompleteCases.map(
        aCase => () =>
          setManuallyAddedCaseAsCalendared(
            {
              applicationContext,
              caseRecord: aCase,
              trialSessionEntity,
            },
            authorizedUser,
          ),
      ),
      ...eligibleCases.map(
        aCase => () =>
          setTrialSessionCalendarForEligibleCase(
            {
              applicationContext,
              caseRecord: aCase as RawCase,
              trialSessionEntity,
            },
            authorizedUser,
          ),
      ),
    ];

    // Story: 10422
    //If we executed all functions at once we may exhaust the available connections and run into timeouts.
    //So instead we use a priority queue so that only CHUNK_SIZE number of functions will execute at any given time.
    //This has the additional benefit over feeding the chunks to Promise.all(), as the priority queue will swap out
    //completed tasks for new tasks until completion, whereas Promise.all() will block until every promise in
    //a given chunk is completed.
    const queue = new PQueue({ concurrency: CHUNK_SIZE });
    await queue.addAll(funcs);

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
      userId: authorizedUser.userId,
    });
  } catch (error: any) {
    applicationContext.logger.error(
      `Error setting trial session calendar for trialSessionId: ${trialSessionId}`,
    );
    applicationContext.logger.error(error);
    console.log(error);
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'set_trial_session_calendar_error',
        message: `Error setting trial session calendar: ${error?.message}`,
      },
      userId: authorizedUser?.userId || '',
    });
  }
};

const removeManuallyAddedCaseFromTrialSession = (
  {
    applicationContext,
    caseRecord,
    trialSessionEntity,
  }: {
    applicationContext: ServerApplicationContext;
    caseRecord: RawCase;
    trialSessionEntity: TrialSession;
  },
  authorizedUser: AuthUser,
): Promise<RawCase> => {
  trialSessionEntity.deleteCaseFromCalendar({
    docketNumber: caseRecord.docketNumber,
  });

  const caseEntity = new Case(caseRecord, {
    authorizedUser,
  });

  caseEntity.removeFromTrialWithAssociatedJudge();

  return applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate: caseEntity,
  });
};

const setManuallyAddedCaseAsCalendared = async (
  {
    applicationContext,
    caseRecord,
    trialSessionEntity,
  }: {
    applicationContext: ServerApplicationContext;
    caseRecord: RawCase;
    trialSessionEntity: TrialSession;
  },
  authorizedUser: AuthUser,
): Promise<void> => {
  const caseEntity = new Case(caseRecord, { authorizedUser });

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
      authorizedUser,
      caseToUpdate: caseEntity,
    }),
  ]);
};

const setTrialSessionCalendarForEligibleCase = async (
  {
    applicationContext,
    caseRecord,
    trialSessionEntity,
  }: {
    applicationContext: ServerApplicationContext;
    caseRecord: RawCase;
    trialSessionEntity: TrialSession;
  },
  authorizedUser: AuthUser,
): Promise<void> => {
  const caseEntity = new Case(caseRecord, { authorizedUser });

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
      authorizedUser,
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

import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TRIAL_SESSION_ELIGIBLE_CASES_BUFFER } from '@shared/business/entities/EntityConstants';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  acquireLock,
  removeLock,
} from '@web-api/business/useCaseHelper/acquireLock';
import { flatten, isEmpty, partition, uniq } from 'lodash';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import {
  deleteTrialSortMappingRecordsForEligibleCases,
  updateDeadlinesForCasesToCalendar,
} from '@web-api/business/useCases/trialSessions/trialSessionCalendarInteractorUtils';

export const setTrialSessionCalendarInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    trialSessionId,
  }: { trialSessionId: string; clientConnectionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  let docketNumbersToLock: string[] = [];
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
    trialSessionEntity.setAsCalendared();
    trialSessionEntity.validate();

    // We will get cases already associated with the trial session as well as cases that are eligible
    const manuallyAddedCases = await applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession({
        applicationContext,
        trialSessionId,
      });

    // Manually added cases are already on the caseOrder, so if they have not been QCed we have to remove them
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

    docketNumbersToLock = uniq(
      flatten([
        eligibleCases.map(({ docketNumber }) => docketNumber),
        manuallyAddedQcCompleteCases.map(({ docketNumber }) => docketNumber),
        manuallyAddedQcIncompleteCases.map(({ docketNumber }) => docketNumber),
      ]),
    );

    // We are about to kick off a bunch of promises. If any of them fails, case data can get into an inconsistent state.
    // We therefore validate cases beforehand.
    [
      ...eligibleCases,
      ...manuallyAddedQcCompleteCases,
      ...manuallyAddedQcIncompleteCases,
    ].forEach(c => new Case(c, { authorizedUser }).validate());

    await acquireLock({
      applicationContext,
      authorizedUser,
      identifiers: docketNumbersToLock.map(item => `case|${item}`),
      ttl: 15 * 60, // Full lambda execution time
    });

    const manuallyAddedQcCompleteCaseEntities =
      manuallyAddedQcCompleteCases.map(c => {
        const theCase = new Case(c, { authorizedUser });
        theCase.setAsCalendared(trialSessionEntity);
        return theCase.validate().toRawObject();
      });

    const eligibleCaseEntities = eligibleCases.map(c => {
      const theCase = new Case(c, { authorizedUser });
      theCase.setAsCalendared(trialSessionEntity);
      trialSessionEntity.addCaseToCalendar(theCase);
      return theCase.validate().toRawObject();
    });

    const manuallyAddedQcIncompleteCaseEntities =
      manuallyAddedQcIncompleteCases.map(c => {
        const theCase = new Case(c, { authorizedUser });
        theCase.removeFromTrialWithAssociatedJudge();
        trialSessionEntity.deleteCaseFromCalendar({
          docketNumber: theCase.docketNumber,
        });
        return theCase.validate().toRawObject();
      });

    const caseEntitiesToCalendar = [
      ...manuallyAddedQcCompleteCaseEntities,
      ...eligibleCaseEntities,
    ];

    // We will remove from any association with the trial session for cases that are not yet QCed
    const caseEntitiesToNotCalendar = [
      ...manuallyAddedQcIncompleteCaseEntities,
    ];

    const updatesToPersist: Promise<any>[] = [
      upsertCases([...caseEntitiesToCalendar, ...caseEntitiesToNotCalendar]),
      deleteTrialSortMappingRecordsForEligibleCases({
        applicationContext,
        eligibleCases: eligibleCaseEntities,
      }),
    ];

    if (!isEmpty(caseEntitiesToCalendar)) {
      updatesToPersist.push(
        // We may need to update related work items and deadlines for newly calendared cases depending on the trial session judge.
        // TODO: These updates should NOT be done here. Instead, we should remove associatedJudge and associatedJudgeId from dwCaseDeadline and dwWorkItem and reference these columns on dwCase.
        updateDeadlinesForCasesToCalendar({
          casesToCalendar: caseEntitiesToCalendar,
          trialSessionEntity,
        }),
      );
    }

    // Persist all case updates
    await settlePromises(updatesToPersist);

    // Persist the update to the trial session itself
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
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'set_trial_session_calendar_error',
        message: `Error setting trial session calendar: ${error?.message}`,
      },
      userId: authorizedUser?.userId || '',
    });
  } finally {
    await removeLock({
      applicationContext,
      identifiers: docketNumbersToLock.map(item => `case|${item}`),
    });
  }
};

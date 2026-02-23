import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { HIGH_PRIORITY_SUFFIXES } from '@shared/business/entities/EntityConstants';
import {
  TCaseOrder,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { isEmpty, flatten, partition, uniq } from 'lodash';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { updateDeadlinesForCasesToCalendar } from '@web-api/persistence/postgres/caseDeadlines/trialSessionCalendarInteractorUtils';
import { acquireLock } from '@web-api/persistence/postgres/utils/mutex';
import { getEligibleCasesForTrialSession } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialSession';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getCalendaredCasesForTrialSession } from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { updateTrialSession } from '@web-api/persistence/postgres/trialSessions/updateTrialSession';
import { createOrUpdateTrialSessionCases } from '@web-api/persistence/postgres/trialSessions/createOrUpdateTrialSessionCases';
import { deleteCasesFromTrialSession } from '@web-api/persistence/postgres/trialSessions/deleteCasesFromTrialSession';

export const setTrialSessionCalendarInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    trialSessionId,
  }: { trialSessionId: string; clientConnectionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  let docketNumbersToLock: string[] = [];
  // default to no-op in case error is thrown before acquireLock is called
  let removeLockFunction: () => Promise<void> = async () => {};

  try {
    if (
      !isAuthorized(authorizedUser, ROLE_PERMISSIONS.SET_TRIAL_SESSION_CALENDAR)
    ) {
      throw new UnauthorizedError('Unauthorized');
    }

    const trialSession = await getTrialSessionById({
      trialSessionId,
    });

    if (!trialSession) {
      throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
    }

    const trialSessionEntity = new TrialSession(trialSession);
    trialSessionEntity.setAsCalendared();
    trialSessionEntity.validate();

    // We will get cases already associated with the trial session as well as cases that are eligible
    const manuallyAddedCases = await getCalendaredCasesForTrialSession({
      trialSessionId,
      excludeFields: ['correspondence', 'hearings'],
    });

    // Manually added cases are already on the caseOrder, so if they have not been QCed we have to remove them
    const [manuallyAddedQcCompleteCases, manuallyAddedQcIncompleteCases] =
      partition(
        // TODO Add extra filter here for hearings for data safety
        manuallyAddedCases,
        manualCase =>
          manualCase.qcCompleteForTrial &&
          manualCase.qcCompleteForTrial[trialSessionId] === true,
      );

    const eligibleCases = (
      await getEligibleCasesForTrialSession({
        sessionType: trialSessionEntity.getCaseProcedureForTrial(),
        trialCity: trialSessionEntity.trialLocation!,
      })
    )
      .filter(
        eligibleCase =>
          eligibleCase.qcCompleteForTrial &&
          eligibleCase.qcCompleteForTrial[trialSessionId] === true,
      )
      .sort((a, b) => {
        const aSuffixIsHighPriority =
          a.docketNumberSuffix &&
          HIGH_PRIORITY_SUFFIXES.includes(a.docketNumberSuffix);
        const bSuffixIsHighPriority =
          b.docketNumberSuffix &&
          HIGH_PRIORITY_SUFFIXES.includes(b.docketNumberSuffix);

        if (aSuffixIsHighPriority && !bSuffixIsHighPriority) return -1;
        if (!aSuffixIsHighPriority && bSuffixIsHighPriority) return 1;

        return 0;
      })
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

    removeLockFunction = await acquireLock({
      applicationContext,
      authorizedUser,
      identifiers: docketNumbersToLock.map(item => `case|${item}`),
    });

    const manuallyAddedQcCompleteCaseEntities =
      manuallyAddedQcCompleteCases.map(c => {
        const theCase = new Case(c, { authorizedUser });
        theCase.setAsCalendared(trialSessionEntity);
        return theCase.validate().toRawObject();
      });

    const caseOrdersToAdd: TCaseOrder[] = [];
    const caseOrdersToDelete: TCaseOrder[] = [];

    const eligibleCaseEntities = eligibleCases.map(c => {
      const theCase = new Case(c, { authorizedUser });
      theCase.setAsCalendared(trialSessionEntity);
      caseOrdersToAdd.push(trialSessionEntity.addCaseToCalendar(theCase));
      return theCase.validate().toRawObject();
    });

    const manuallyAddedQcIncompleteCaseEntities =
      manuallyAddedQcIncompleteCases.map(c => {
        const theCase = new Case(c, { authorizedUser });
        theCase.removeFromTrialWithAssociatedJudge();
        caseOrdersToDelete.push(
          trialSessionEntity.deleteCaseFromCalendar({
            docketNumber: theCase.docketNumber,
          })!,
        );
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
      createOrUpdateTrialSessionCases({
        trialSessionCases: caseOrdersToAdd.map(TCO => ({
          caseOrder: TCO,
          trialSessionId,
          docketNumber: TCO.docketNumber,
          isHearing: false,
        })),
      }),
      deleteCasesFromTrialSession({
        trialSessionId,
        docketNumbers: caseOrdersToDelete.map(CO => CO.docketNumber),
      }),
    ];

    if (!isEmpty(caseEntitiesToCalendar)) {
      updatesToPersist.push(
        // We may need to update related deadlines for newly calendared cases depending on the trial session judge.
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
    await updateTrialSession({
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
    await removeLockFunction();
  }
};

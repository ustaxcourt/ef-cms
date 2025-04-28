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
import { acquireLock } from '@web-api/business/useCaseHelper/acquireLock';
import { flatten, partition, uniq } from 'lodash';
import { setPriorityOnAllWorkItems } from '@web-api/persistence/postgres/workitems/setPriorityOnAllWorkItems';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

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
    trialSessionEntity.setAsCalendared();
    trialSessionEntity.validate();

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
      identifiers: allDocketNumbers.map(item => `case|${item}`),
      ttl: 900,
    });

    // These we need to update work items and deadlines for
    const manuallyAddedQcCompleteCaseEntities =
      manuallyAddedQcCompleteCases.map(c => {
        const theCase = new Case(c, { authorizedUser });
        theCase.setAsCalendared(trialSessionEntity);
        return theCase.validate().toRawObject();
      });

    // These we need to update work items and deadlines for
    const eligibleCaseEntities = eligibleCases.map(c => {
      const theCase = new Case(c, { authorizedUser });
      theCase.setAsCalendared(trialSessionEntity);
      trialSessionEntity.addCaseToCalendar(theCase);
      return theCase.validate().toRawObject();
    });

    // These we will remove from any association with the trial session
    const manuallyAddedQcIncompleteCaseEntities =
      manuallyAddedQcIncompleteCases.map(c => {
        const theCase = new Case(c, { authorizedUser });
        theCase.removeFromTrialWithAssociatedJudge();
        trialSessionEntity.deleteCaseFromCalendar({
          docketNumber: theCase.docketNumber,
        });
        return theCase.validate().toRawObject();
      });

    await settlePromises([
      upsertCases([
        ...manuallyAddedQcCompleteCaseEntities,
        ...manuallyAddedQcIncompleteCaseEntities,
        ...eligibleCaseEntities,
      ]),
      setPriorityOnAllWorkItems({
        docketNumbers: [...eligibleCases, ...manuallyAddedQcCompleteCases].map(
          c => c.docketNumber,
        ),
        highPriority: true,
      }),
      // We could fetch all case deadlines and all work items, set the judge fields, validate, and then upsert instead.
      // Need to check for empty map (since kysely throws error for "in" [])
      pgUpdateTable({
        table: 'dwCaseDeadline',
        values: {
          associatedJudge: trialSessionEntity.judge?.name, // probably need null?
          associatedJudgeId: trialSessionEntity.judge?.userId, // probably need null?
        },
        where: db =>
          db.where(
            'docketNumber',
            'in',
            [...eligibleCases, ...manuallyAddedQcCompleteCases].map(
              c => c.docketNumber,
            ),
          ),
      }),
      // Need to check for empty map (since kysely throws error for "in" [])
      pgUpdateTable({
        table: 'dwWorkItem',
        values: {
          associatedJudge: trialSessionEntity.judge?.name, // probably need null?
          associatedJudgeId: trialSessionEntity.judge?.userId, // probably need null?
        },
        where: db =>
          db.where(
            'docketNumber',
            'in',
            [...eligibleCases, ...manuallyAddedQcCompleteCases].map(
              c => c.docketNumber,
            ),
          ),
      }),
    ]);

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

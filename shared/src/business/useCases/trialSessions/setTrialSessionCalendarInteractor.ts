import { Case } from '../../entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import {
  RawTrialSession,
  TrialSession,
} from '../../entities/trialSessions/TrialSession';
import { TRIAL_SESSION_ELIGIBLE_CASES_BUFFER } from '../../entities/EntityConstants';
import { acquireLock } from '@shared/business/useCaseHelper/acquireLock';
import { flatten, partition, uniq } from 'lodash';

export const setTrialSessionCalendarInteractor = async (
  applicationContext: IApplicationContext,
  { trialSessionId }: { trialSessionId: string },
): Promise<RawTrialSession> => {
  const user = applicationContext.getCurrentUser();

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
    trialSessionEntity.maxCases + TRIAL_SESSION_ELIGIBLE_CASES_BUFFER;

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
      trialSessionEntity.maxCases - manuallyAddedQcCompleteCases.length,
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

  /**
   * sets a manually added case as calendared with the trial session details
   * @param {object} caseRecord the providers object
   * @returns {Promise} the promise of the updateCase call
   */
  const setManuallyAddedCaseAsCalendared = caseRecord => {
    const caseEntity = new Case(caseRecord, { applicationContext });

    caseEntity.setAsCalendared(trialSessionEntity);

    return Promise.all([
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

  /**
   * sets an eligible case as calendared and adds it to the trial session calendar
   * @param {object} caseRecord the providers object
   * @returns {Promise} the promises of the updateCase and deleteCaseTrialSortMappingRecords calls
   */
  const setTrialSessionCalendarForEligibleCase = caseRecord => {
    const caseEntity = new Case(caseRecord, { applicationContext });

    caseEntity.setAsCalendared(trialSessionEntity);
    trialSessionEntity.addCaseToCalendar(caseEntity);

    return Promise.all([
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

  await Promise.all([
    ...manuallyAddedQcIncompleteCases.map(caseRecord =>
      removeManuallyAddedCaseFromTrialSession({
        applicationContext,
        caseRecord,
        trialSessionEntity,
      }),
    ),
    ...manuallyAddedQcCompleteCases.map(setManuallyAddedCaseAsCalendared),
    ...eligibleCases.map(setTrialSessionCalendarForEligibleCase),
  ]);

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  await Promise.all(
    allDocketNumbers.map(docketNumber =>
      applicationContext.getPersistenceGateway().removeLock({
        applicationContext,
        identifiers: [`case|${docketNumber}`],
      }),
    ),
  );

  return new TrialSession(trialSessionEntity.toRawObject(), {
    applicationContext,
  })
    .validate()
    .toRawObject();
};

const removeManuallyAddedCaseFromTrialSession = ({
  applicationContext,
  caseRecord,
  trialSessionEntity,
}: {
  applicationContext: IApplicationContext;
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

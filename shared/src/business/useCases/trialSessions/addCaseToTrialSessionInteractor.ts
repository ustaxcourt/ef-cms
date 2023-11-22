import { Case } from '../../entities/cases/Case';
import { NotFoundError } from '../../../../../web-api/src/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 * addCaseToTrialSession
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.calendarNotes notes for why the trial session/hearing was added
 * @param {string} providers.trialSessionId the id of the trial session
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise} the promise of the addCaseToTrialSession call
 */
export const addCaseToTrialSession = async (
  applicationContext: IApplicationContext,
  {
    calendarNotes,
    docketNumber,
    trialSessionId,
  }: {
    calendarNotes: string;
    docketNumber: string;
    trialSessionId: string;
  },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ADD_CASE_TO_TRIAL_SESSION)) {
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

  const caseDetails = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseDetails, { applicationContext });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  if (caseEntity.isCalendared()) {
    throw new Error('The case is already calendared');
  }

  if (trialSessionEntity.isCaseAlreadyCalendared(caseEntity)) {
    throw new Error('The case is already part of this trial session.');
  }

  trialSessionEntity
    .deleteCaseFromCalendar({ docketNumber: caseEntity.docketNumber }) // we delete because it might have been manually removed
    .manuallyAddCaseToCalendar({ calendarNotes, caseEntity });

  caseEntity.setAsCalendared(trialSessionEntity);

  await applicationContext
    .getPersistenceGateway()
    .deleteCaseTrialSortMappingRecords({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
    });

  if (trialSessionEntity.isCalendared) {
    await applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
      highPriority: true,
      trialDate: caseEntity.trialDate,
    });
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};

export const addCaseToTrialSessionInteractor = withLocking(
  addCaseToTrialSession,
  (_applicationContext: IApplicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { createOrUpdateTrialSessionCases } from '@web-api/persistence/postgres/trialSessions/createOrUpdateTrialSessionCases';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

/**
 * addCaseToTrialSession
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.calendarNotes notes for why the trial session/hearing was added
 * @param {string} providers.trialSessionId the id of the trial session
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise} the promise of the addCaseToTrialSession call
 */
const addCaseToTrialSession = async (
  _applicationContext: ServerApplicationContext,
  {
    calendarNotes,
    docketNumber,
    trialSessionId,
  }: {
    calendarNotes: string;
    docketNumber: string;
    trialSessionId: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<CaseDTO> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_CASE_TO_TRIAL_SESSION)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const caseDetails = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseEntity = new Case(caseDetails, { authorizedUser });

  const trialSessionEntity = new TrialSession(trialSession);

  if (caseEntity.isCalendared()) {
    throw new Error('The case is already calendared');
  }

  if (trialSessionEntity.isCaseAlreadyCalendared(caseEntity)) {
    throw new Error('The case is already part of this trial session.');
  }

  // Removing and adding the case in memory to match the change we will make in the DB
  trialSessionEntity.deleteCaseFromCalendar({
    docketNumber: caseEntity.docketNumber,
  });
  const caseOrder = trialSessionEntity.manuallyAddCaseToCalendar({
    calendarNotes,
    caseEntity,
    isHearing: false,
  });

  caseEntity.setAsCalendared(trialSessionEntity);

  const updatedCase = await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  await createOrUpdateTrialSessionCases({
    trialSessionCases: [
      {
        caseOrder,
        docketNumber,
        isHearing: false,
        trialSessionId,
      },
    ],
  });

  return new CaseDTO(
    new Case(updatedCase, { authorizedUser }).validate().toRawObject(),
  );
};

export const addCaseToTrialSessionInteractor = withLocking(
  addCaseToTrialSession,
  (_applicationContext: ServerApplicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  createWorkingCopyForNewUserOnSession,
  getPaperServicePdfName,
  shouldCreateWorkingCopyForNewJudge,
  shouldCreateWorkingCopyForNewTrialClerk,
  shouldGenerateNoticeOfChangeOfTrialJudge,
  shouldGenerateNoticeOfChangeToInPersonProceeding,
  shouldGenerateNoticeOfChangeToRemoteProceeding,
  updateCasesAndSetNoticeOfChange,
} from '@web-api/business/useCases/trialSessions/updateTrialSessionInteractorHelper';
import { shouldGenerateNoticeOfChangeTrialLocation } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialLocation';
import { shouldGenerateNoticeOfChangeTrialStartDate } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialStartDate';
import { saveFileAndGenerateUrl } from '@web-api/business/useCaseHelper/saveFileAndGenerateUrl';
import { associateSwingTrialSessions } from '@web-api/business/useCaseHelper/trialSessions/associateSwingTrialSessions';
import { sendNotificationToUser } from '@web-api/notifications/sendNotificationToUser';
import { updateTrialSession as updateTrialSessionPersistence } from '@web-api/persistence/postgres/trialSessions/updateTrialSession';
import {
  asyncHandleLockError,
  withLocking,
} from '@web-api/persistence/postgres/utils/mutex';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import {
  formatDateString,
  formatNow,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { ROLES } from '@shared/business/entities/EntityConstants';

type UpdateTrialSessionParams = {
  trialSession: RawTrialSession;
  clientConnectionId: string;
};

export const updateTrialSession = async (
  applicationContext: ServerApplicationContext,
  { clientConnectionId, trialSession }: UpdateTrialSessionParams,
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const currentTrialSession = (await getTrialSessionById({
    trialSessionId: trialSession.trialSessionId!,
  }))!;

  const startDateFormatted = formatDateString(
    currentTrialSession.startDate,
    FORMATS.YYYYMMDD,
  );
  const nowFormatted = formatNow(FORMATS.YYYYMMDD);

  if (
    startDateFormatted <= nowFormatted &&
    authorizedUser &&
    authorizedUser.role !== ROLES.caseServicesSupervisor
  ) {
    throw new Error(
      'Trial session cannot be updated after its start date and you are not a case services supervisor.',
    );
  }

  const inputStartDateFormatted = formatDateString(
    trialSession.startDate,
    FORMATS.YYYYMMDD,
  );

  if (
    startDateFormatted !== inputStartDateFormatted &&
    inputStartDateFormatted <= nowFormatted
  ) {
    throw new Error('Cannot change the start date to today or a past date.');
  }

  const LIMITED_EDITABLE_FIELDS: string[] = [
    'alternateTrialClerkName',
    'courtReporter',
    'dismissedAlertForNott',
    'estimatedEndDate',
    'irsCalendarAdministrator',
    'irsCalendarAdministratorInfo',
    'term',
    'termYear',
    'trialClerk',
    'trialClerkId',
  ];

  const ALL_EDITABLE_FIELDS: string[] = [
    'address1',
    'address2',
    'alternateTrialClerkName',
    'chambersPhoneNumber',
    'city',
    'courtReporter',
    'courthouseName',
    'dismissedAlertForNott',
    'estimatedEndDate',
    'irsCalendarAdministrator',
    'irsCalendarAdministratorInfo',
    'joinPhoneNumber',
    'judge',
    'maxCases',
    'meetingId',
    'notes',
    'password',
    'postalCode',
    'proceedingType',
    'sessionType',
    'startDate',
    'startTime',
    'state',
    'swingSession',
    'swingSessionId',
    'term',
    'termYear',
    'trialClerk',
    'trialClerkId',
    'trialLocation',
  ];

  const isCaseServicesSupervisorLimitedEdit =
    startDateFormatted <= nowFormatted &&
    authorizedUser?.role === ROLES.caseServicesSupervisor;

  if (isCaseServicesSupervisorLimitedEdit) {
    const limitedEditableFieldSet = new Set<string>(LIMITED_EDITABLE_FIELDS);
    const disallowedChanges = Object.keys(trialSession)
      .filter(key => ALL_EDITABLE_FIELDS.includes(key))
      .filter(key => {
        if (limitedEditableFieldSet.has(key)) return false;
        if (
          JSON.stringify(trialSession[key]) !==
          JSON.stringify(currentTrialSession[key])
        ) {
          return true;
        }
      });

    if (disallowedChanges.length > 0) {
      throw new UnauthorizedError(
        `Unauthorized changes: ${disallowedChanges.join(', ')}`,
      );
    }
  }

  const allowedFields = isCaseServicesSupervisorLimitedEdit
    ? LIMITED_EDITABLE_FIELDS
    : ALL_EDITABLE_FIELDS;

  const editableFields = Object.fromEntries(
    allowedFields.map(key => [key, trialSession[key]]),
  );

  const updatedTrialSessionEntity = new TrialSession({
    ...currentTrialSession,
    ...editableFields,
  });

  const createWorkingCopyForNewJudge = shouldCreateWorkingCopyForNewJudge(
    currentTrialSession,
    updatedTrialSessionEntity,
  );

  if (createWorkingCopyForNewJudge) {
    await createWorkingCopyForNewUserOnSession({
      trialSessionId: updatedTrialSessionEntity.trialSessionId,
      userId: updatedTrialSessionEntity.judge?.userId,
    });
  }

  const createWorkingCopyForNewTrialClerk =
    shouldCreateWorkingCopyForNewTrialClerk(
      currentTrialSession,
      updatedTrialSessionEntity,
    );

  if (createWorkingCopyForNewTrialClerk) {
    await createWorkingCopyForNewUserOnSession({
      trialSessionId: updatedTrialSessionEntity.trialSessionId,
      userId: updatedTrialSessionEntity.trialClerk?.userId,
    });
  }

  let hasPaper: boolean | undefined;
  let pdfUrl: string | undefined;
  let fileId: string | undefined;
  if (currentTrialSession.caseOrder?.length) {
    const shouldSetNoticeOfChangeToInPersonProceeding =
      shouldGenerateNoticeOfChangeToInPersonProceeding(
        currentTrialSession,
        updatedTrialSessionEntity,
      );

    const shouldIssueNoticeOfChangeOfTrialJudge =
      shouldGenerateNoticeOfChangeOfTrialJudge(
        currentTrialSession,
        updatedTrialSessionEntity,
      );

    const shouldSetNoticeOfChangeToRemoteProceeding =
      shouldGenerateNoticeOfChangeToRemoteProceeding(
        currentTrialSession,
        updatedTrialSessionEntity,
      );

    const shouldSetNoticeOfTrialSessionLocationChange =
      shouldGenerateNoticeOfChangeTrialLocation(
        currentTrialSession,
        updatedTrialSessionEntity,
      );

    const shouldSetNoticeOfTrialSessionStartDateChange =
      shouldGenerateNoticeOfChangeTrialStartDate(
        currentTrialSession,
        updatedTrialSessionEntity,
      );

    const paperServicePdfsCombined = await updateCasesAndSetNoticeOfChange({
      applicationContext,
      authorizedUser,
      currentTrialSession,
      shouldIssueNoticeOfChangeOfTrialJudge,
      shouldSetNoticeOfChangeToInPersonProceeding,
      shouldSetNoticeOfChangeToRemoteProceeding,
      shouldSetNoticeOfTrialSessionLocationChange,
      shouldSetNoticeOfTrialSessionStartDateChange,
      updatedTrialSessionEntity,
    });

    hasPaper = !!paperServicePdfsCombined.getPageCount();
    const paperServicePdfData = await paperServicePdfsCombined.save();

    if (hasPaper) {
      ({ fileId, url: pdfUrl } = await saveFileAndGenerateUrl({
        applicationContext,
        file: paperServicePdfData,
        fileNamePrefix: 'paper-service-pdf/',
      }));

      const paperServicePdfName = getPaperServicePdfName({
        shouldIssueNoticeOfChangeOfTrialJudge,
        shouldSetNoticeOfChangeToInPersonProceeding,
        shouldSetNoticeOfChangeToRemoteProceeding,
        shouldSetNoticeOfTrialSessionLocationChange,
        shouldSetNoticeOfTrialSessionStartDateChange,
      });

      updatedTrialSessionEntity.addPaperServicePdf(fileId, paperServicePdfName);
    }
  }

  if (trialSession.swingSession && trialSession.swingSessionId) {
    await associateSwingTrialSessions(
      {
        swingSessionId: trialSession.swingSessionId,
        trialSessionEntity: updatedTrialSessionEntity,
      },
      authorizedUser,
    );
  }

  await updateTrialSessionPersistence({
    trialSessionToUpdate: updatedTrialSessionEntity.validate().toRawObject(),
  });

  await sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'update_trial_session_complete',
      fileId,
      hasPaper,
      pdfUrl,
      trialSessionId: trialSession.trialSessionId,
    },
    userId: authorizedUser.userId,
  });
};

export const determineEntitiesToLock = async (
  _applicationContext: ServerApplicationContext,
  { trialSession }: { trialSession: TrialSession },
) => {
  const currentTrialSession = await getTrialSessionById({
    trialSessionId: trialSession.trialSessionId || '',
  });

  if (!currentTrialSession) {
    throw new NotFoundError(
      `Trial session ${trialSession.trialSessionId} was not found.`,
    );
  }

  const { caseOrder } = currentTrialSession;

  const entitiesToLock = [`trial-session|${trialSession.trialSessionId}`];

  caseOrder?.forEach(({ docketNumber }) =>
    entitiesToLock.push(`case|${docketNumber}`),
  );

  return {
    identifiers: entitiesToLock,
    ttl: 900,
  };
};

export const updateTrialSessionInteractor = withLocking(
  updateTrialSession,
  determineEntitiesToLock,
  asyncHandleLockError,
);

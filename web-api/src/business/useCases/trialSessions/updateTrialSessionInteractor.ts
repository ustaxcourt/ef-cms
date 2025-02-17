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
import { asyncHandleLockError, withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { getTrialSessionById } from '@web-api/persistence/dynamo/trialSessions/getTrialSessionById';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { saveFileAndGenerateUrl } from '@web-api/business/useCaseHelper/saveFileAndGenerateUrl';
import { associateSwingTrialSessions } from '@web-api/business/useCaseHelper/trialSessions/associateSwingTrialSessions';
import { sendNotificationToUser } from '@web-api/notifications/sendNotificationToUser';
import { updateTrialSession as updateTrialSessionPersistence } from '@web-api/persistence/dynamo/trialSessions/updateTrialSession';

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
    applicationContext,
    trialSessionId: trialSession.trialSessionId!,
  }))!;

  if (currentTrialSession.startDate < createISODateString()) {
    throw new Error('Trial session cannot be updated after its start date');
  }

  const editableFields = {
    address1: trialSession.address1,
    address2: trialSession.address2,
    alternateTrialClerkName: trialSession.alternateTrialClerkName,
    chambersPhoneNumber: trialSession.chambersPhoneNumber,
    city: trialSession.city,
    courtReporter: trialSession.courtReporter,
    courthouseName: trialSession.courthouseName,
    dismissedAlertForNOTT: trialSession.dismissedAlertForNOTT,
    estimatedEndDate: trialSession.estimatedEndDate,
    irsCalendarAdministrator: trialSession.irsCalendarAdministrator,
    irsCalendarAdministratorInfo: trialSession.irsCalendarAdministratorInfo,
    joinPhoneNumber: trialSession.joinPhoneNumber,
    judge: trialSession.judge,
    maxCases: trialSession.maxCases,
    meetingId: trialSession.meetingId,
    notes: trialSession.notes,
    password: trialSession.password,
    postalCode: trialSession.postalCode,
    proceedingType: trialSession.proceedingType,
    sessionType: trialSession.sessionType,
    startDate: trialSession.startDate,
    startTime: trialSession.startTime,
    state: trialSession.state,
    swingSession: trialSession.swingSession,
    swingSessionId: trialSession.swingSessionId,
    term: trialSession.term,
    termYear: trialSession.termYear,
    trialClerk: trialSession.trialClerk,
    trialLocation: trialSession.trialLocation,
  };

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
      applicationContext,
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
      applicationContext,
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

    const paperServicePdfsCombined = await updateCasesAndSetNoticeOfChange({
      applicationContext,
      authorizedUser,
      currentTrialSession,
      shouldIssueNoticeOfChangeOfTrialJudge,
      shouldSetNoticeOfChangeToInPersonProceeding,
      shouldSetNoticeOfChangeToRemoteProceeding,
      shouldSetNoticeOfTrialSessionLocationChange,
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
      });

      updatedTrialSessionEntity.addPaperServicePdf(fileId, paperServicePdfName);
    }
  }

  if (trialSession.swingSession && trialSession.swingSessionId) {
    await associateSwingTrialSessions(
      applicationContext,
      {
        swingSessionId: trialSession.swingSessionId,
        trialSessionEntity: updatedTrialSessionEntity,
      },
      authorizedUser,
    );
  }

  await updateTrialSessionPersistence({
    applicationContext,
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
  applicationContext: ServerApplicationContext,
  { trialSession }: { trialSession: TrialSession },
) => {
  const currentTrialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
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

export const updateTrialSessionInteractor = withLocking<
  UpdateTrialSessionParams,
  void
>(updateTrialSession, determineEntitiesToLock, asyncHandleLockError);

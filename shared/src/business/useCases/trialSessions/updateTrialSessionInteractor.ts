/* eslint-disable complexity */
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
import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../entities/EntityConstants';
import { TrialSessionWorkingCopy } from '../../entities/trialSessions/TrialSessionWorkingCopy';
import { get } from 'lodash';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

export const updateTrialSession = async (
  applicationContext: IApplicationContext,
  {
    clientConnectionId,
    trialSession,
  }: { trialSession: RawTrialSession; clientConnectionId: string },
): Promise<void> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const currentTrialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId: trialSession.trialSessionId!,
    });

  if (!currentTrialSession) {
    throw new NotFoundError(
      `Trial session ${trialSession.trialSessionId} was not found.`,
    );
  }

  if (
    currentTrialSession.startDate <
    applicationContext.getUtilities().createISODateString()
  ) {
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

  const updatedTrialSessionEntity = new TrialSession(
    { ...currentTrialSession, ...editableFields },
    {
      applicationContext,
    },
  );

  const shouldCreateWorkingCopyForNewJudge =
    (!get(currentTrialSession, 'judge.userId') &&
      get(updatedTrialSessionEntity, 'judge.userId')) ||
    (currentTrialSession.judge &&
      updatedTrialSessionEntity.judge &&
      currentTrialSession.judge.userId !==
        updatedTrialSessionEntity.judge.userId);

  if (shouldCreateWorkingCopyForNewJudge) {
    await createWorkingCopyForNewUserOnSession({
      applicationContext,
      trialSessionId: updatedTrialSessionEntity.trialSessionId,
      userId: updatedTrialSessionEntity.judge?.userId,
    });
  }

  const shouldCreateWorkingCopyForNewTrialClerk =
    (!get(currentTrialSession, 'trialClerk.userId') &&
      get(updatedTrialSessionEntity, 'trialClerk.userId')) ||
    (currentTrialSession.trialClerk &&
      updatedTrialSessionEntity.trialClerk &&
      currentTrialSession.trialClerk.userId !==
        updatedTrialSessionEntity.trialClerk.userId);

  if (shouldCreateWorkingCopyForNewTrialClerk) {
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
    const { PDFDocument } = await applicationContext.getPdfLib();
    const paperServicePdfsCombined = await PDFDocument.create();

    const shouldSetNoticeOfChangeToInPersonProceeding =
      currentTrialSession.proceedingType ===
        TRIAL_SESSION_PROCEEDING_TYPES.remote &&
      updatedTrialSessionEntity.proceedingType ===
        TRIAL_SESSION_PROCEEDING_TYPES.inPerson &&
      updatedTrialSessionEntity.isCalendared;

    const shouldIssueNoticeOfChangeOfTrialJudge =
      currentTrialSession.isCalendared &&
      !!currentTrialSession.judge &&
      !!updatedTrialSessionEntity.judge &&
      currentTrialSession.judge.userId !==
        updatedTrialSessionEntity.judge.userId;

    const shouldSetNoticeOfChangeToRemoteProceeding =
      currentTrialSession.proceedingType ===
        TRIAL_SESSION_PROCEEDING_TYPES.inPerson &&
      updatedTrialSessionEntity.proceedingType ===
        TRIAL_SESSION_PROCEEDING_TYPES.remote &&
      updatedTrialSessionEntity.isCalendared;

    await updateCasesAndSetNoticeOfChange({
      applicationContext,
      currentTrialSession,
      paperServicePdfsCombined,
      shouldIssueNoticeOfChangeOfTrialJudge,
      shouldSetNoticeOfChangeToInPersonProceeding,
      shouldSetNoticeOfChangeToRemoteProceeding,
      updatedTrialSessionEntity,
      user,
    });

    hasPaper = !!paperServicePdfsCombined.getPageCount();
    const paperServicePdfData = await paperServicePdfsCombined.save();

    if (hasPaper) {
      ({ fileId, url: pdfUrl } = await applicationContext
        .getUseCaseHelpers()
        .saveFileAndGenerateUrl({
          applicationContext,
          file: paperServicePdfData,
          fileNamePrefix: 'paper-service-pdf/',
        }));
      const paperServicePdfName = getPaperServicePdfName({
        shouldIssueNoticeOfChangeOfTrialJudge,
        shouldSetNoticeOfChangeToInPersonProceeding,
        shouldSetNoticeOfChangeToRemoteProceeding,
      });

      updatedTrialSessionEntity.addPaperServicePdf(fileId, paperServicePdfName);
    }
  }

  if (trialSession.swingSession && trialSession.swingSessionId) {
    applicationContext
      .getUseCaseHelpers()
      .associateSwingTrialSessions(applicationContext, {
        swingSessionId: trialSession.swingSessionId,
        trialSessionEntity: updatedTrialSessionEntity,
      });
  }

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: updatedTrialSessionEntity.validate().toRawObject(),
  });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'update_trial_session_complete',
      fileId,
      hasPaper,
      pdfUrl,
      trialSessionId: trialSession.trialSessionId,
    },
    userId: user.userId,
  });
};

const updateCasesAndSetNoticeOfChange = async ({
  applicationContext,
  currentTrialSession,
  paperServicePdfsCombined,
  shouldIssueNoticeOfChangeOfTrialJudge,
  shouldSetNoticeOfChangeToInPersonProceeding,
  shouldSetNoticeOfChangeToRemoteProceeding,
  updatedTrialSessionEntity,
  user,
}: {
  applicationContext: IApplicationContext;
  currentTrialSession: RawTrialSession;
  paperServicePdfsCombined: any;
  updatedTrialSessionEntity: TrialSession;
  user: any;
  shouldSetNoticeOfChangeToRemoteProceeding: boolean;
  shouldSetNoticeOfChangeToInPersonProceeding: boolean;
  shouldIssueNoticeOfChangeOfTrialJudge: boolean;
}): Promise<void> => {
  const calendaredCaseEntities = await Promise.all(
    currentTrialSession
      .caseOrder!.filter(c => !c.removedFromTrial)
      .map(async c => {
        const aCase = await applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber({
            applicationContext,
            docketNumber: c.docketNumber,
          });
        return new Case(aCase, { applicationContext });
      }),
  );
  const casesThatShouldReceiveNotices = calendaredCaseEntities
    .filter(aCase => !aCase.isClosed())
    .filter(
      aCase =>
        aCase.trialSessionId === updatedTrialSessionEntity.trialSessionId,
    );
  for (const caseEntity of casesThatShouldReceiveNotices) {
    if (shouldSetNoticeOfChangeToRemoteProceeding) {
      await applicationContext
        .getUseCaseHelpers()
        .setNoticeOfChangeToRemoteProceeding(applicationContext, {
          caseEntity,
          newPdfDoc: paperServicePdfsCombined,
          newTrialSessionEntity: updatedTrialSessionEntity,
          user: applicationContext.getCurrentUser(),
        });
    }

    if (shouldSetNoticeOfChangeToInPersonProceeding) {
      await applicationContext
        .getUseCaseHelpers()
        .setNoticeOfChangeToInPersonProceeding(applicationContext, {
          caseEntity,
          newPdfDoc: paperServicePdfsCombined,
          newTrialSessionEntity: updatedTrialSessionEntity,
          user: applicationContext.getCurrentUser(),
        });
    }

    if (shouldIssueNoticeOfChangeOfTrialJudge) {
      await applicationContext
        .getUseCaseHelpers()
        .setNoticeOfChangeOfTrialJudge(applicationContext, {
          caseEntity,
          currentTrialSession,
          newPdfDoc: paperServicePdfsCombined,
          newTrialSessionEntity: updatedTrialSessionEntity,
          user,
        });
    }

    caseEntity.updateTrialSessionInformation(updatedTrialSessionEntity);

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });
  }

  const updatedHearingPromises = calendaredCaseEntities.map(async aCase => {
    const matchingHearing = aCase.hearings.find(
      hearing =>
        hearing.trialSessionId == updatedTrialSessionEntity.trialSessionId,
    );
    if (matchingHearing) {
      await applicationContext.getPersistenceGateway().updateCaseHearing({
        applicationContext,
        docketNumber: aCase.docketNumber,
        hearingToUpdate: updatedTrialSessionEntity.validate().toRawObject(),
      });
    }
  });
  await Promise.all(updatedHearingPromises);
};

const createWorkingCopyForNewUserOnSession = async ({
  applicationContext,
  trialSessionId,
  userId,
}) => {
  const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
    trialSessionId,
    userId,
  });

  await applicationContext
    .getPersistenceGateway()
    .createTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopy: trialSessionWorkingCopyEntity
        .validate()
        .toRawObject(),
    });
};

const getPaperServicePdfName = ({
  shouldIssueNoticeOfChangeOfTrialJudge,
  shouldSetNoticeOfChangeToInPersonProceeding,
  shouldSetNoticeOfChangeToRemoteProceeding,
}: {
  shouldSetNoticeOfChangeToRemoteProceeding: boolean;
  shouldSetNoticeOfChangeToInPersonProceeding: boolean;
  shouldIssueNoticeOfChangeOfTrialJudge: boolean;
}): string => {
  if (shouldIssueNoticeOfChangeOfTrialJudge) {
    return 'Notice of Change of Trial Judge';
  } else if (shouldSetNoticeOfChangeToInPersonProceeding) {
    return 'Notice of Change to In Person Proceeding';
  } else if (shouldSetNoticeOfChangeToRemoteProceeding) {
    return 'Notice of Change to Remote Proceeding';
  } else {
    return 'Notice of Change';
  }
};

export const determineEntitiesToLock = async (
  applicationContext: IApplicationContext,
  { trialSession }: { trialSession: TrialSession },
) => {
  const { caseOrder } = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId: trialSession.trialSessionId || '',
    });

  const entitiesToLock = [`trial-session|${trialSession.trialSessionId}`];

  caseOrder?.forEach(({ docketNumber }) =>
    entitiesToLock.push(`case|${docketNumber}`),
  );

  return {
    identifiers: entitiesToLock,
    ttl: 900,
  };
};

export const handleLockError = async (
  applicationContext: IApplicationContext,
  originalRequest: any,
) => {
  const user = applicationContext.getCurrentUser();

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'retry_async_request',
      originalRequest,
      requestToRetry: 'update_trial_session',
    },
    userId: user.userId,
  });
};

export const updateTrialSessionInteractor = withLocking(
  updateTrialSession,
  determineEntitiesToLock,
  handleLockError,
);

import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { asyncHandleLockError, withLocking } from '@web-api/business/useCaseHelper/acquireLock';

const setNoticesForCalendaredTrialSession = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    trialSessionId,
  }: { trialSessionId: string; clientConnectionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const calendaredCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  const trialNoticePdfsKeys: string[] = [];

  if (calendaredCases.length === 0) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'notice_generation_complete',
        hasPaper: false,
        trialNoticePdfsKeys,
        trialSessionId,
      },
      userId: authorizedUser.userId,
    });

    return;
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'notice_generation_start',
      totalCases: calendaredCases.length,
    },
    userId: authorizedUser.userId,
  });

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

  const trialSessionProcessingStatus = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionProcessingStatus({
      applicationContext,
      trialSessionId,
    });

  if (
    trialSessionProcessingStatus &&
    (trialSessionProcessingStatus === 'processing' ||
      trialSessionProcessingStatus === 'complete')
  ) {
    applicationContext.logger.warn(
      `A duplicate event was received for setting the notices for trial session: ${trialSessionId}`,
    );
    return;
  }

  const jobId = trialSessionId;

  await applicationContext
    .getPersistenceGateway()
    .setTrialSessionProcessingStatus({
      applicationContext,
      trialSessionId,
      trialSessionStatus: 'processing',
    });

  await applicationContext.getPersistenceGateway().createJobStatus({
    applicationContext,
    docketNumbers: calendaredCases.map(
      calendaredCase => calendaredCase.docketNumber,
    ),
    jobId,
  });

  for (const calendaredCase of calendaredCases) {
    await applicationContext
      .getMessageGateway()
      .sendSetTrialSessionCalendarEvent({
        applicationContext,
        payload: {
          docketNumber: calendaredCase.docketNumber,
          jobId,
          trialSession,
          userId: authorizedUser.userId,
        },
      });
  }

  await waitForJobToFinish({ applicationContext, jobId });

  await applicationContext
    .getPersistenceGateway()
    .setTrialSessionProcessingStatus({
      applicationContext,
      trialSessionId,
      trialSessionStatus: 'complete',
    });

  trialSessionEntity.setNoticesIssued();

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  for (const calendaredCase of calendaredCases) {
    const casePdfDocumentsExistsInS3 = await applicationContext
      .getPersistenceGateway()
      .isFileExists({
        applicationContext,
        key: `${jobId}-${calendaredCase.docketNumber}`,
        useTempBucket: true,
      });

    if (!casePdfDocumentsExistsInS3) {
      continue;
    }

    trialNoticePdfsKeys.push(`${jobId}-${calendaredCase.docketNumber}`);
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'notice_generation_complete',
      trialNoticePdfsKeys,
      trialSessionId: trialSessionEntity.trialSessionId,
    },
    userId: authorizedUser.userId,
  });

  if (trialNoticePdfsKeys.length) {
    await applicationContext
      .getUseCases()
      .generateTrialSessionPaperServicePdfInteractor(
        applicationContext,
        {
          clientConnectionId,
          trialNoticePdfsKeys,
          trialSessionId,
        },
        authorizedUser,
      );
  }
};

const waitForJobToFinish = async ({
  applicationContext,
  jobId,
}: {
  applicationContext: ServerApplicationContext;
  jobId: string;
}): Promise<void> => {
  const { unfinishedCases } = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionJobStatusForCase({
      applicationContext,
      jobId,
    });
  if (unfinishedCases === 0) {
    return;
  }

  await new Promise(resolve => setTimeout(resolve, 3000));
  await waitForJobToFinish({ applicationContext, jobId });
};

export const determineEntitiesToLock = async (
  applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
) => {
  const calendaredCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({ applicationContext, trialSessionId });

  return {
    identifiers: calendaredCases.map(
      ({ docketNumber }) => `case|${docketNumber}`,
    ),
    ttl: 900,
  };
};

export const setNoticesForCalendaredTrialSessionInteractor = withLocking(
  setNoticesForCalendaredTrialSession,
  determineEntitiesToLock,
  asyncHandleLockError,
);

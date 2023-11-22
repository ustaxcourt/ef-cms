import { NotFoundError } from '../../../../../web-api/src/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

export const setNoticesForCalendaredTrialSession = async (
  applicationContext: IApplicationContext,
  {
    clientConnectionId,
    trialSessionId,
  }: { trialSessionId: string; clientConnectionId: string },
): Promise<void> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let calendaredCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  let trialNoticePdfsKeys: string[] = [];

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
      userId: user.userId,
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
    userId: user.userId,
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

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

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
      `A duplicate event was recieved for setting the notices for trial session: ${trialSessionId}`,
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

  for (let calendaredCase of calendaredCases) {
    await applicationContext
      .getMessageGateway()
      .sendSetTrialSessionCalendarEvent({
        applicationContext,
        payload: {
          docketNumber: calendaredCase.docketNumber,
          jobId,
          trialSession,
          userId: user.userId,
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

  for (let calendaredCase of calendaredCases) {
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
    userId: user.userId,
  });

  if (trialNoticePdfsKeys.length) {
    await applicationContext
      .getUseCases()
      .generateTrialSessionPaperServicePdfInteractor(applicationContext, {
        clientConnectionId,
        trialNoticePdfsKeys,
        trialSessionId,
      });
  }
};

const waitForJobToFinish = async ({
  applicationContext,
  jobId,
}: {
  applicationContext: IApplicationContext;
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
  applicationContext: IApplicationContext,
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

export const handleLockError = async (
  applicationContext: IApplicationContext,
  originalRequest: any,
) => {
  const user = applicationContext.getCurrentUser();

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId: originalRequest.clientConnectionId,
    message: {
      action: 'retry_async_request',
      originalRequest,
      requestToRetry: 'set_notices_for_calendared_trial_session',
    },
    userId: user.userId,
  });
};

export const setNoticesForCalendaredTrialSessionInteractor = withLocking(
  setNoticesForCalendaredTrialSession,
  determineEntitiesToLock,
  handleLockError,
);

import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  asyncHandleLockError,
  withLocking,
} from '@web-api/persistence/postgres/utils/mutex';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getCalendaredCasesForTrialSession } from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { updateTrialSession } from '@web-api/persistence/postgres/trialSessions/updateTrialSession';
import { createTrialSessionNotificationProcessing } from '@web-api/persistence/postgres/trialSessions/createTrialSessionNotificationProcessing';
import { updateTrialSessionNotificationProcessing } from '@web-api/persistence/postgres/trialSessions/updateTrialSessionNotificationProcessing';
import { getTrialSessionNotificationProcessing } from '@web-api/persistence/postgres/trialSessions/getTrialSessionNotificationProcessing';

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

  const calendaredCases = await getCalendaredCasesForTrialSession({
    trialSessionId,
    excludeFields: [
      'docketEntries',
      'privatePractitioners',
      'irsPractitioners',
      'correspondence',
      'hearings',
    ],
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

  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const trialSessionEntity = new TrialSession(trialSession);

  const trialSessionProcessingStatus = (
    await getTrialSessionNotificationProcessing({ trialSessionId })
  )?.status;

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

  await createTrialSessionNotificationProcessing({
    trialSessionId,
    unfinishedCasesCount: calendaredCases.length,
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

  await updateTrialSessionNotificationProcessing({
    status: 'complete',
    trialSessionId,
  });

  trialSessionEntity.setNoticesIssued();

  await updateTrialSession({
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
  const processingJob = await getTrialSessionNotificationProcessing({
    trialSessionId: jobId,
  });
  if (!processingJob)
    throw new NotFoundError(
      `Could not get notification processing job with id ${jobId}`,
    );

  if (processingJob.unfinishedCases <= 0) {
    return;
  }

  await new Promise(resolve => setTimeout(resolve, 3000));
  await waitForJobToFinish({ applicationContext, jobId });
};

export const determineEntitiesToLock = async (
  _applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
) => {
  const calendaredCases = await getCalendaredCasesForTrialSession({
    trialSessionId,
    excludeFields: [
      'docketEntries',
      'privatePractitioners',
      'irsPractitioners',
      'correspondence',
      'hearings',
    ],
  });

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

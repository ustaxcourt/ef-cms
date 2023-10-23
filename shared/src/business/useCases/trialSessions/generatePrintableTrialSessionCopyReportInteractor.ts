import { Case } from '../../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { RawTrialSession } from '../../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';

export const generatePrintableTrialSessionCopyReportInteractor = async (
  applicationContext: IApplicationContext,
  {
    filters,
    formattedCases,
    formattedTrialSession,
    sessionNotes,
    showCaseNotes,
    sort,
    userHeading,
  }: {
    filters: TPrintableTableFilters;
    formattedCases: Case[];
    formattedTrialSession: RawTrialSession;
    sessionNotes: string;
    showCaseNotes: boolean;
    sort: string;
    userHeading: string;
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const pdf = await applicationContext
    .getDocumentGenerators()
    .printableWorkingCopySessionList({
      applicationContext,
      data: {
        filters,
        formattedCases,
        formattedTrialSession,
        sessionNotes,
        showCaseNotes,
        sort,
        userHeading,
      },
    });

  const key = `trial-session-printable-copy-${applicationContext.getUniqueId()}.pdf`;

  await new Promise<void>((resolve, reject) => {
    const documentsBucket =
      applicationContext.environment.tempDocumentsBucketName;
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: pdf,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: key,
    };

    s3Client.upload(params, function (err) {
      if (err) {
        applicationContext.logger.error('error uploading to s3', err);
        reject(err);
      }
      resolve();
    });
  });

  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      key,
      useTempBucket: true,
    });

  return url;
};

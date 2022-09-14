import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';
import {
  createISODateString,
  formatDateString,
  formatNow,
  FORMATS,
} from '../../utilities/DateHandler';
/**
 * generatePrintableTrialSessionCopyReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.judge the optional judge filter
 * @param {string} providers.docketNumber the optional docketNumber filter
 * @returns {Array} the url of the document
 */
export const generatePrintableTrialSessionCopyReportInteractor = async (
  applicationContext: IApplicationContext,
  {
    caseNotesFlag,
    filters,
    formattedCases,
    formattedTrialSession,
    nameToDisplay,
    sessionNotes,
  }: {
    caseNotesFlag: boolean,
    filters: string[],
    formattedCases: TCase[],
    formattedTrialSession: TTrialSessionData,
    nameToDisplay: string,
    sessionNotes: string,
  },
): Promise<void> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  console.log('nameToDisplay*** ', nameToDisplay);

  // get formattedStart time and end time and format to use Feb 16, 2023
  const { formattedStartDate, formattedEstimatedEndDate } = formattedTrialSession;

  const newFormattedStartDate = createISODateString(formattedStartDate, FORMATS.YYMDD)
  console.log('newFormattedStartDate', newFormattedStartDate);
  

  const pdf = await applicationContext
    .getDocumentGenerators()
    .printableWorkingCopySessionList({
      applicationContext,
      data: {
        caseNotesFlag,
        filters,
        formattedCases,
        formattedTrialSession,
        nameToDisplay,
        sessionNotes,
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

import { ALLOWLIST_FEATURE_FLAGS } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * generatePrintableTrialSessionCopyReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.filters the selected trial status filters
 * @param {array} providers.formattedCases the case data formatted as on the non-printable version
 * @param {object} providers.formattedTrialSession the trial session data formatted as on the non-printable version
 * @param {string} providers.sessionNotes the user's session notes if any
 * @param {boolean} providers.showCaseNotes a flag for whether to show case notes or not
 * @param {boolean} providers.sort the name of the column that the table is sorted by
 * @param {boolean} providers.userHeading the string '{some name} - Session Copy' that should be displayed depending on who the user is
 * @returns {string} the url of the document
 */
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
    formattedCases: TCase[];
    formattedTrialSession: TTrialSessionData;
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

  const areUpdatedTrialSessionTypesEnabled = await applicationContext
    .getUseCases()
    .getFeatureFlagValueInteractor(applicationContext, {
      featureFlag: ALLOWLIST_FEATURE_FLAGS.UPDATED_TRIAL_STATUS_TYPES.key,
    });

  const pdf = await applicationContext
    .getDocumentGenerators()
    .printableWorkingCopySessionList({
      applicationContext,
      data: {
        areUpdatedTrialSessionTypesEnabled,
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

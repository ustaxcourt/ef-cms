import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export const generatePrintableTrialSessionCopyReportInteractor = async (
  applicationContext: ServerApplicationContext,
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
): Promise<string> => {
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

  await applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    pdfData: pdf,
    pdfName: key,
    useTempBucket: true,
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

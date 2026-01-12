import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

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
    trialStatusCounts,
  }: {
    filters: TPrintableTableFilters;
    formattedCases: Case[];
    formattedTrialSession: RawTrialSession;
    sessionNotes: string;
    showCaseNotes: boolean;
    sort: string;
    userHeading: string;
    trialStatusCounts: {[caseNumber: string]: number}
  },
  authorizedUser: UnknownAuthUser,
): Promise<string> => {
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
        trialStatusCounts,
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

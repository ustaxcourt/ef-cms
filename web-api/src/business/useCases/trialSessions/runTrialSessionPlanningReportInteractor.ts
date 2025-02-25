import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { capitalize } from 'lodash';

export const runTrialSessionPlanningReportInteractor = async (
  applicationContext: ServerApplicationContext,
  { term, year }: { term: string; year: string },
  authorizedUser: UnknownAuthUser,
): Promise<{
  fileId: string;
  url: string;
}> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const reportData = await applicationContext
    .getUseCases()
    .getTrialSessionPlanningReportDataInteractor(
      applicationContext,
      { term, year },
      authorizedUser,
    );

  const trialSessionPlanningReport = await applicationContext
    .getDocumentGenerators()
    .trialSessionPlanningReport({
      applicationContext,
      data: {
        locationData: reportData.trialLocationData,
        previousTerms: reportData.previousTerms,
        term: `${capitalize(term)} ${year}`,
      },
    });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file: trialSessionPlanningReport,
    useTempBucket: true,
  });
};

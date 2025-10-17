import { UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUniqueId } from '@shared/sharedAppContext';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getDownloadPolicyUrl } from '@web-api/persistence/s3/getDownloadPolicyUrl';
import { generateMinuteSheetFilename } from '@web-api/business/useCaseHelper/trialSessionMinutes/generateMinuteSheetFilename';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { createAndUploadMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/createAndUploadMinuteSheet';

export const generateTrialSessionMinutesPdfInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, trialSessionId },
  authorizedUser: UnknownAuthUser,
): Promise<string> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_MINUTE_SHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const aCase = await getCaseByDocketNumber({
    docketNumber,
  });

  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!aCase || !trialSession) {
    throw new Error('Case and trial session could not be retrieved');
  }

  const docketEntryId = getUniqueId();

  await createAndUploadMinuteSheet(applicationContext, {
    docketNumber,
    trialSessionId,
    aCase,
    trialSession,
    docketEntryId,
  });

  const { url } = await getDownloadPolicyUrl({
    applicationContext,
    key: docketEntryId,
    filename: generateMinuteSheetFilename({ trialSession, caseDetail: aCase }),
  });

  return url;
};

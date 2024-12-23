// import {
//   ROLE_PERMISSIONS,
//   isAuthorized,
// } from '@shared/authorization/authorizationClientService';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { query } from '@web-api/persistence/dynamodbClientService';
// import { UnauthorizedError } from '@web-api/errors/errors';
// import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const generateTrialSessionMinutesPdfInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, trialSessionId },
  // authorizedUser: UnknownAuthUser,
): Promise<string> => {
  // 10419 TODO: add role-permissions configuration for minutes sheet
  //   if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MINUTES_SHEET)) {
  //     throw new UnauthorizedError('Unauthorized');
  //   }

  const results = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${trialSessionId}|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  const aCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (!aCase || !trialSession) {
    throw new Error('Case and trial session could not be retrieved');
  }

  const formattedMinuteSheet = formatMinuteSheet({
    aCase,
    minuteSheetFormState: JSON.parse(results[0].minuteSheet),
    trialSession,
  });

  const pdf = await applicationContext.getDocumentGenerators().minuteSheet({
    applicationContext,
    data: {
      formattedMinuteSheet,
    },
  });

  const key = `minutes-sheet-${applicationContext.getUniqueId()}.pdf`;

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

export type FormattedMinuteSheet = {
  courtReporter: string;
  judge: string;
  remoteSession: string;
  trialClerk: string;
  trialLocation: string;
  trialStartDate: string;
};

const formatMinuteSheet = ({
  aCase,
  minuteSheetFormState,
  trialSession,
}: {
  minuteSheetFormState: MinuteSheetFormState;
  trialSession: RawTrialSession;
  aCase: RawCase;
}): FormattedMinuteSheet => {
  return {
    courtReporter:
      minuteSheetFormState.trialSessionMetadataSection.courtReporter,
    judge: minuteSheetFormState.trialSessionMetadataSection.judge,
    remoteSession: minuteSheetFormState.trialSessionMetadataSection
      .remoteSession
      ? 'Yes'
      : 'No',
    trialClerk: minuteSheetFormState.trialSessionMetadataSection.trialClerk,
    trialLocation: trialSession.trialLocation!,
    trialStartDate: formatDateString(
      trialSession.startDate,
      FORMATS.MONTH_DAY_YEAR,
    ),
  };
};

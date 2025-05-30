import {
  FORMATS,
  createISODateString,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { NotFoundError } from '@web-api/errors/errors';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { getJudgeWithTitle } from '@shared/business/utilities/getJudgeWithTitle';
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

export type FormattedTrialInfoType = RawTrialSession & {
  formattedStartDate: string;
  formattedStartTime: string;
  formattedJudge: string;
};

export const generateNoticeOfTrialIssuedInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    trialSessionId,
  }: { docketNumber: string; trialSessionId: string },
): Promise<Uint8Array> => {
  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const caseDetail = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  const { docketNumberWithSuffix } = caseDetail;
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const formattedStartDate = formatDateString(
    trialSession.startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  const trialStartTimeIso = createISODateString(
    trialSession.startTime,
    'HH:mm',
  );
  const formattedStartTime = formatDateString(trialStartTimeIso, FORMATS.TIME);

  const judgeWithTitle = await getJudgeWithTitle({
    applicationContext,
    judgeUserName: trialSession.judge.name,
  });

  const { CLERK_OF_THE_COURT_CONFIGURATION } =
    applicationContext.getConstants();

  const [CLERK_OF_THE_COURT_RECORD] = await getFeatureFlagValues([
    CLERK_OF_THE_COURT_CONFIGURATION,
  ]);

  const { name, title } = CLERK_OF_THE_COURT_RECORD.value.current as {
    name: string;
    title: string;
  };
  const trialInfo: FormattedTrialInfoType = {
    formattedJudge: judgeWithTitle,
    formattedStartDate,
    formattedStartTime,
    ...trialSession,
  };

  if (trialSession.proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.inPerson) {
    return await applicationContext
      .getDocumentGenerators()
      .noticeOfTrialIssuedInPerson({
        applicationContext,
        data: {
          caseCaptionExtension,
          caseTitle,
          docketNumberWithSuffix,
          nameOfClerk: name,
          titleOfClerk: title,
          trialInfo,
        },
      });
  } else {
    return await applicationContext
      .getDocumentGenerators()
      .noticeOfTrialIssued({
        applicationContext,
        data: {
          caseCaptionExtension,
          caseTitle,
          docketNumberWithSuffix,
          nameOfClerk: name,
          titleOfClerk: title,
          trialInfo,
        },
      });
  }
};

import {
  FORMATS,
  createISODateString,
  formatDateString,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { NotFoundError } from '@web-api/errors/errors';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { getCaseCaptionMeta } from '../../../../../shared/src/business/utilities/getCaseCaptionMeta';
import { getJudgeWithTitle } from '../../../../../shared/src/business/utilities/getJudgeWithTitle';

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

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
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

  const { name, title } = await applicationContext
    .getPersistenceGateway()
    .getConfigurationItemValue({
      applicationContext,
      configurationItemKey:
        applicationContext.getConstants().CLERK_OF_THE_COURT_CONFIGURATION,
    });

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

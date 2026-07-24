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
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getClerkOfTheCourtInfo } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue';
import { formatTrialNoticePhoneNumber } from '@shared/business/utilities/formatPhoneNumber';

export type FormattedTrialInfoType = RawTrialSession & {
  formattedStartDate: string;
  formattedStartTime?: string;
  formattedJudge?: string;
  trialLocationAndProceedingType?: string;
  priorJudgeTitleWithFullName?: string;
  updatedJudgeTitleWithFullName?: string;
  caseProcedureType?: string;
};

export const generateNoticeOfTrialIssuedInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    trialSessionId,
  }: { docketNumber: string; trialSessionId: string },
): Promise<Uint8Array> => {
  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const caseDetail = await getCaseByDocketNumber({
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

  const formattedJudge = trialSession.judge?.name || 'Not assigned';

  const { name, title } = await getClerkOfTheCourtInfo();

  const trialInfo: FormattedTrialInfoType = {
    ...trialSession,
    chambersPhoneNumber: formatTrialNoticePhoneNumber(
      trialSession.chambersPhoneNumber,
    ),
    formattedJudge,
    formattedStartDate,
    formattedStartTime,
    joinPhoneNumber: formatTrialNoticePhoneNumber(trialSession.joinPhoneNumber),
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

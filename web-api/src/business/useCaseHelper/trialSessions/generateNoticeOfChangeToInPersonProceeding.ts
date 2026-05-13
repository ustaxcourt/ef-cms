import {
  FORMATS,
  createISODateString,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
import { formatPhoneNumber } from '@shared/business/utilities/formatPhoneNumber';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { getJudgeWithTitle } from '@web-api/business/utilities/getJudgeWithTitle';
import { NoticeOfChangeToInPersonTrialInfo } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfChangeToInPersonProceeding';

export type GenerateNoticeOfChangeToInPersonTrialInfo = Omit<
  NoticeOfChangeToInPersonTrialInfo,
  'formattedJudge' | 'formattedStartDate' | 'formattedStartTime'
> & {
  startDate: string;
  startTime: string;
  judgeName: string;
};

export const generateNoticeOfChangeToInPersonProceeding = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    trialSessionInformation,
  }: {
    docketNumber: string;
    trialSessionInformation: GenerateNoticeOfChangeToInPersonTrialInfo;
  },
): Promise<Uint8Array> => {
  const formattedStartDate = formatDateString(
    trialSessionInformation.startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  const trialStartTimeIso = createISODateString(
    trialSessionInformation.startTime,
    FORMATS.TIME_24_HOUR,
  );
  const formattedStartTime = formatDateString(trialStartTimeIso, FORMATS.TIME);

  const judgeWithTitle = await getJudgeWithTitle({
    judgeUserName: trialSessionInformation.judgeName,
  });

  const trialInfo: NoticeOfChangeToInPersonTrialInfo = {
    ...trialSessionInformation,
    chambersPhoneNumber: formatPhoneNumber(
      trialSessionInformation.chambersPhoneNumber,
    ),
    formattedJudge: judgeWithTitle,
    formattedStartDate,
    formattedStartTime,
  };

  const caseDetail = await getCaseByDocketNumber({
    docketNumber,
  });

  const { docketNumberWithSuffix } = caseDetail;
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);
  const { CLERK_OF_THE_COURT_CONFIGURATION } =
    applicationContext.getConstants();

  const [CLERK_OF_THE_COURT_RECORD] = await getFeatureFlagValues([
    CLERK_OF_THE_COURT_CONFIGURATION,
  ]);

  const { name, title } = CLERK_OF_THE_COURT_RECORD.value.current as {
    name: string;
    title: string;
  };

  return await applicationContext
    .getDocumentGenerators()
    .noticeOfChangeToInPersonProceeding({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix: docketNumberWithSuffix || docketNumber,
        nameOfClerk: name,
        titleOfClerk: title,
        trialInfo,
      },
    });
};

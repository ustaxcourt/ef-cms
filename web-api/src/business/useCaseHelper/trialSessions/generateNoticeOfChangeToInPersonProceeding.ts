import {
  FORMATS,
  createISODateString,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getClerkOfTheCourtInfo } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue';
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
  const { name, title } = await getClerkOfTheCourtInfo();

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

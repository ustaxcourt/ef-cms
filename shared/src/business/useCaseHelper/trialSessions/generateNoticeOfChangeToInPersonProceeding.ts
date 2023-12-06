import {
  FORMATS,
  createISODateString,
  formatDateString,
} from '../../utilities/DateHandler';
import { formatPhoneNumber } from '../../utilities/formatPhoneNumber';
import { getCaseCaptionMeta } from '../../utilities/getCaseCaptionMeta';
import { getJudgeWithTitle } from '../../utilities/getJudgeWithTitle';

export const generateNoticeOfChangeToInPersonProceeding = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    trialSessionInformation,
  }: { docketNumber: string; trialSessionInformation: any },
): Promise<Buffer> => {
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
    applicationContext,
    judgeUserName: trialSessionInformation.judgeName,
  });

  const trialInfo = {
    ...trialSessionInformation,
    chambersPhoneNumber: formatPhoneNumber(
      trialSessionInformation.chambersPhoneNumber,
    ),
    formattedJudge: judgeWithTitle,
    formattedStartDate,
    formattedStartTime,
    joinPhoneNumber: formatPhoneNumber(trialSessionInformation.joinPhoneNumber),
  };

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const { docketNumberWithSuffix } = caseDetail;
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);
  const clerkOftheCourtConfigurationKey: string =
    applicationContext.getConstants().CLERK_OF_THE_COURT_CONFIGURATION;

  const { name, title } = await applicationContext
    .getPersistenceGateway()
    .getConfigurationItemValue({
      applicationContext,
      configurationItemKey: clerkOftheCourtConfigurationKey,
    });

  return await applicationContext
    .getDocumentGenerators()
    .noticeOfChangeToInPersonProceeding({
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
};

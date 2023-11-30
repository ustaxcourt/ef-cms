import {
  FORMATS,
  createISODateString,
  formatDateString,
} from '../../utilities/DateHandler';
import { TrialSessionInformationType } from '@shared/business/useCaseHelper/trialSessions/setNoticeOfChangeToRemoteProceeding';
import { formatPhoneNumber } from '../../utilities/formatPhoneNumber';
import { getCaseCaptionMeta } from '../../utilities/getCaseCaptionMeta';
import { getJudgeWithTitle } from '../../utilities/getJudgeWithTitle';

export type TrialInfoType = TrialSessionInformationType & {
  formattedJudge: string;
  formattedStartDate: string;
  formattedStartTime: string;
};

export const generateNoticeOfChangeToRemoteProceedingInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    trialSessionInformation,
  }: { docketNumber; trialSessionInformation: TrialSessionInformationType },
): Promise<Buffer> => {
  const formattedStartDate = formatDateString(
    trialSessionInformation.startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  const trialStartTimeIso = createISODateString(
    trialSessionInformation.startTime,
    'HH:mm',
  );
  const formattedStartTime = formatDateString(trialStartTimeIso, FORMATS.TIME);

  const judgeWithTitle = await getJudgeWithTitle({
    applicationContext,
    judgeUserName: trialSessionInformation.judgeName,
  });

  const trialInfo: TrialInfoType = {
    ...trialSessionInformation,
    chambersPhoneNumber: formatPhoneNumber(
      trialSessionInformation.chambersPhoneNumber,
    ),
    formattedJudge: judgeWithTitle,
    formattedStartDate,
    formattedStartTime,
    joinPhoneNumber: formatPhoneNumber(trialSessionInformation.joinPhoneNumber),
  };

  const { name, title } = await applicationContext
    .getPersistenceGateway()
    .getConfigurationItemValue({
      applicationContext,
      configurationItemKey:
        applicationContext.getConstants().CLERK_OF_THE_COURT_CONFIGURATION,
    });

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const { docketNumberWithSuffix } = caseDetail;
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  return await applicationContext
    .getDocumentGenerators()
    .noticeOfChangeToRemoteProceeding({
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

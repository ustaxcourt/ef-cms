import {
  FORMATS,
  createISODateString,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSessionInformationType } from '@web-api/business/useCaseHelper/trialSessions/setNoticeOfChangeToRemoteProceeding';
import { formatPhoneNumber } from '@shared/business/utilities/formatPhoneNumber';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { getJudgeWithTitle } from '@shared/business/utilities/getJudgeWithTitle';

export type TrialInfoType = TrialSessionInformationType & {
  formattedJudge: string;
  formattedStartDate: string;
  formattedStartTime: string;
};

export const generateNoticeOfChangeToRemoteProceedingInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    trialSessionInformation,
  }: { docketNumber; trialSessionInformation: TrialSessionInformationType },
): Promise<Uint8Array> => {
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

  const { CLERK_OF_THE_COURT_CONFIGURATION } =
    applicationContext.getConstants();

  const [CLERK_OF_THE_COURT_RECORD] = await getFeatureFlagValues([
    CLERK_OF_THE_COURT_CONFIGURATION,
  ]);

  const { name, title } = CLERK_OF_THE_COURT_RECORD.value.current as {
    name: string;
    title: string;
  };

  const caseDetail = await getCaseByDocketNumber({
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
        docketNumberWithSuffix: docketNumberWithSuffix || docketNumber,
        nameOfClerk: name,
        titleOfClerk: title,
        trialInfo,
      },
    });
};

import { FORMATS, formatDateString } from '../../utilities/DateHandler';
import { RawTrialSession } from '../../entities/trialSessions/TrialSession';
import { TRIAL_SESSION_SCOPE_TYPES } from '../../entities/EntityConstants';
import { formatPhoneNumber } from '../../utilities/formatPhoneNumber';
import { getCaseCaptionMeta } from '../../utilities/getCaseCaptionMeta';

export type FormattedTrialInfo = RawTrialSession & {
  chambersPhoneNumber: string | undefined;
  formattedStartDate: string | void;
  trialLocationAndProceedingType: string;
};

export const generateNoticeOfChangeOfTrialJudgeInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    trialSessionInformation,
  }: {
    docketNumber: string;
    trialSessionInformation: RawTrialSession;
  },
): Promise<Buffer> => {
  const formattedStartDate = formatDateString(
    trialSessionInformation.startDate,
    FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
  );

  let trialLocationAndProceedingType = `${trialSessionInformation.trialLocation}, ${trialSessionInformation.proceedingType}`;
  if (
    trialSessionInformation.sessionScope ===
    TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
  ) {
    trialLocationAndProceedingType = 'standalone remote';
  }

  const trialInfo: FormattedTrialInfo = {
    ...trialSessionInformation,
    chambersPhoneNumber: formatPhoneNumber(
      trialSessionInformation.chambersPhoneNumber,
    ),
    formattedStartDate,
    trialLocationAndProceedingType,
  };

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const clerkOftheCourtInfo =
    applicationContext.getConstants().CLERK_OF_THE_COURT_CONFIGURATION;

  const { name, title } = await applicationContext
    .getPersistenceGateway()
    .getConfigurationItemValue({
      applicationContext,
      configurationItemKey: clerkOftheCourtInfo,
    });

  const { docketNumberWithSuffix } = caseDetail;
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  return await applicationContext
    .getDocumentGenerators()
    .noticeOfChangeOfTrialJudge({
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

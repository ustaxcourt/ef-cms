import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { FormattedTrialInfoType } from '@web-api/business/useCases/trialSessions/generateNoticeOfTrialIssuedInteractor';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TRIAL_SESSION_SCOPE_TYPES } from '@shared/business/entities/EntityConstants';
import { formatPhoneNumber } from '@shared/business/utilities/formatPhoneNumber';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

export const generateNoticeOfChangeOfTrialJudgeInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    trialSessionInformation,
  }: {
    docketNumber: string;
    trialSessionInformation: RawTrialSession;
  },
): Promise<Uint8Array> => {
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

  const trialInfo: FormattedTrialInfoType = {
    ...trialSessionInformation,
    chambersPhoneNumber: formatPhoneNumber(
      trialSessionInformation.chambersPhoneNumber,
    ),
    formattedStartDate,
    trialLocationAndProceedingType,
  };

  const caseDetail = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
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

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  return await applicationContext
    .getDocumentGenerators()
    .noticeOfChangeOfTrialJudge({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix: caseDetail.docketNumber,
        nameOfClerk: name,
        titleOfClerk: title,
        trialInfo,
      },
    });
};

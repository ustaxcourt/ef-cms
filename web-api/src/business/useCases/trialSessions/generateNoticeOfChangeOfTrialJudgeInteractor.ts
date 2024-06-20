import {
  FORMATS,
  formatDateString,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { FormattedTrialInfoType } from '@web-api/business/useCases/trialSessions/generateNoticeOfTrialIssuedInteractor';
import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TRIAL_SESSION_SCOPE_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { formatPhoneNumber } from '../../../../../shared/src/business/utilities/formatPhoneNumber';
import { getCaseCaptionMeta } from '../../../../../shared/src/business/utilities/getCaseCaptionMeta';

export const generateNoticeOfChangeOfTrialJudgeInteractor = async (
  applicationContext: ServerApplicationContext,
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

  const trialInfo: FormattedTrialInfoType = {
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

  const { name, title } = await applicationContext
    .getPersistenceGateway()
    .getConfigurationItemValue({
      applicationContext,
      configurationItemKey:
        applicationContext.getConstants().CLERK_OF_THE_COURT_CONFIGURATION,
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

import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

export const generateNoticeOfChangeOfTrialStartDateInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    previousTrialSession,
    updatedTrialSession,
  }: {
    docketNumber: string;
    previousTrialSession: RawTrialSession;
    updatedTrialSession: RawTrialSession;
  },
): Promise<Uint8Array> => {
  const caseDetail = await getCaseByDocketNumber({
    docketNumber,
  });

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const { CLERK_OF_THE_COURT_CONFIGURATION } =
    applicationContext.getConstants();

  const [CLERK_OF_THE_COURT_RECORD] = await getFeatureFlagValues([
    CLERK_OF_THE_COURT_CONFIGURATION,
  ]);

  const clerkOfTheCourtRecord = CLERK_OF_THE_COURT_RECORD.value.current as {
    name: string;
    title: string;
  };

  return await applicationContext
    .getDocumentGenerators()
    .noticeOfChangeOfTrialStartDate({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix: caseDetail.docketNumberWithSuffix!,
        previousTrialSession,
        updatedTrialSession,
        clerkOfTheCourtRecord
      },
    });
};

import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getClerkOfTheCourtInfo } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue';

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

  const clerkOfTheCourtRecord = await getClerkOfTheCourtInfo();

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
        clerkOfTheCourtRecord,
      },
    });
};

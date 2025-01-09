import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';

export const generateNoticeOfChangeOfTrialLocationInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    currentTrialSession,
    docketNumber,
    trialSession,
  }: {
    docketNumber: string;
    currentTrialSession: RawTrialSession;
    trialSession: RawTrialSession;
  },
): Promise<Uint8Array> => {
  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  return await applicationContext
    .getDocumentGenerators()
    .noticeOfChangeOfTrialLocation({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        currentTrialSession,
        docketNumberWithSuffix: caseDetail.docketNumberWithSuffix!,
        trialSession,
      },
    });
};

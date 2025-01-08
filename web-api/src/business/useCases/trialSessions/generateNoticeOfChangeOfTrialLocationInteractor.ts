import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const generateNoticeOfChangeOfTrialLocationInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumberWithSuffix,
    trialSession,
  }: {
    docketNumberWithSuffix: string;
    trialSession: RawTrialSession;
  },
): Promise<Uint8Array> => {
  return await applicationContext
    .getDocumentGenerators()
    .noticeOfChangeOfTrialLocation({
      applicationContext,
      data: {
        docketNumberWithSuffix,
        trialSession,
      },
    });
};

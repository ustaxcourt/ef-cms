import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { fromKyselyTrialSession, toKyselyNewTrialSession } from './mapper';

export const createTrialSession = async ({
  trialSession,
}: {
  trialSession: RawTrialSession;
}): Promise<RawTrialSession> => {
  const result = (
    await pgInsertInto({
      table: 'dwTrialSession',
      values: [toKyselyNewTrialSession(trialSession)],
    })
  ).at(0);

  if (!result) throw Error('CreateTrialSession failed to create a record!!');
  let paperPdfs: any[] = [];
  if (trialSession.paperServicePdfs) {
    const THREE_DAYS =
      Math.floor(Date.now() / 1000) + TrialSession.PAPER_SERVICE_PDF_TTL;

    paperPdfs = trialSession.paperServicePdfs.map(pdf => ({
      ...pdf,
      ttl: THREE_DAYS,
      trialSessionId: trialSession.trialSessionId,
    }));

    await pgInsertInto({
      table: 'dwTrialSessionPaperPdf',
      values: paperPdfs,
      onConflictColumns: ['fileId', 'trialSessionId'],
    });
  }

  return fromKyselyTrialSession(result, paperPdfs, []);
};

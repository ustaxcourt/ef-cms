import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import {
  fromKyselyTrialSession,
  toKyselyNewTrialSession,
  toKyselyNewTrialSessionCase,
} from './mapper';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

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
  if (trialSession.paperServicePdfs.length) {
    const nowSeconds = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
    const THREE_DAYS = nowSeconds + TrialSession.PAPER_SERVICE_PDF_TTL;

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

  if (trialSession.caseOrder.length) {
    await pgInsertInto({
      table: 'dwTrialSessionCase',
      values: trialSession.caseOrder.map(co =>
        toKyselyNewTrialSessionCase({
          ...co,
          trialSessionId: trialSession.trialSessionId,
        }),
      ),
      onConflictColumns: ['trialSessionId', 'docketNumber'],
    });
  }

  return fromKyselyTrialSession(result, paperPdfs, []);
};

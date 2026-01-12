import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { toKyselyNewTrialSession } from '@web-api/persistence/postgres/trialSessions/mapper';
import { omit } from 'lodash';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

export const updateTrialSession = async ({
  trialSessionToUpdate,
}: {
  trialSessionToUpdate: RawTrialSession;
}): Promise<void> => {
  const nowSeconds = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  const THREE_DAYS = nowSeconds + TrialSession.PAPER_SERVICE_PDF_TTL;

  const paperPdfs = trialSessionToUpdate.paperServicePdfs.map(pdf => ({
    ...pdf,
    ttl: THREE_DAYS,
    trialSessionId: trialSessionToUpdate.trialSessionId,
  }));

  await settlePromises([
    pgInsertInto({
      table: 'dwTrialSession',
      values: [
        toKyselyNewTrialSession(omit(trialSessionToUpdate, 'paperServicePdfs')),
      ],
      onConflictColumns: ['trialSessionId'],
    }),
    pgInsertInto({
      table: 'dwTrialSessionPaperPdf',
      values: paperPdfs,
      onConflictColumns: ['fileId', 'trialSessionId'],
    }),
  ]);
};

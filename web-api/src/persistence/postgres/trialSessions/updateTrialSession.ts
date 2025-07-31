import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { toKyselyNewTrialSession } from '@web-api/persistence/postgres/trialSessions/mapper';
import { omit } from 'lodash';
import { settlePromises } from '@web-api/utilities/settlePromises';

export const updateTrialSession = async ({
  trialSessionToUpdate,
}: {
  trialSessionToUpdate: RawTrialSession;
}): Promise<void> => {
  const THREE_DAYS =
    Math.floor(Date.now() / 1000) + TrialSession.PAPER_SERVICE_PDF_TTL;

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

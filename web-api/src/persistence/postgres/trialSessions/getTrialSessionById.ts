import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { getDbReader } from '@web-api/database';
import { fromKyselyTrialSession } from './mapper';

export const getTrialSessionById = async ({
  trialSessionId,
}: {
  trialSessionId: string;
}): Promise<RawTrialSession | undefined> => {
  const dbTrialSession = await getDbReader(reader =>
    reader
      .selectFrom('dwTrialSession as ts')
      .selectAll()
      .select(eb =>
        jsonArrayFrom(
          eb
            .selectFrom('dwTrialSessionPaperPdf as tspdf')
            .select('title')
            .select('fileId')
            .whereRef('tspdf.trialSessionId', '=', 'ts.trialSessionId'),
        ).as('pdfs'),
      )
      .select(eb =>
        jsonArrayFrom(
          eb
            .selectFrom('dwTrialSessionCase as tsc')
            .selectAll() // Types WILL lie to us
            .whereRef('tsc.trialSessionId', '=', 'ts.trialSessionId'),
        ).as('caseOrders'),
      )
      .where('trialSessionId', '=', trialSessionId)
      .executeTakeFirst(),
  );

  if (!dbTrialSession) {
    return undefined;
  }

  return fromKyselyTrialSession(dbTrialSession, dbTrialSession.pdfs, dbTrialSession.caseOrders);
};

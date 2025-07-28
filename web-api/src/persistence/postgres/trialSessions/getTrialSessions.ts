import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { getDbReader } from '@web-api/database';
import { fromKyselyTrialSession } from './mapper';
import { jsonArrayFrom } from 'kysely/helpers/postgres';

export const getTrialSessions = async (): Promise<RawTrialSession[]> => {
  const dbTrialSessions = await getDbReader(reader =>
    reader
      .selectFrom('dwTrialSession as ts')
      .selectAll()
      .select(eb =>
        jsonArrayFrom(
          eb
            .selectFrom('dwTrialSessionPaperPdf as tspdf')
            .select(['title', 'fileId'])
            .whereRef('tspdf.trialSessionId', '=', 'ts.trialSessionId'),
        ).as('pdfs'),
      )
      .execute(),
  );

  return dbTrialSessions.map(ts => fromKyselyTrialSession(ts, ts.pdfs));
};

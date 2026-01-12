import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { getDbReader } from '@web-api/database';
import { fromKyselyTrialSession } from './mapper';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { sql } from 'kysely';

export const getTrialSessions = async (): Promise<RawTrialSession[]> => {
  const dbTrialSessions = await getDbReader(reader =>
    reader
      .selectFrom('dwTrialSession as ts')
      .leftJoin(
        'dwTrialSessionCase as tsc',
        'ts.trialSessionId',
        'tsc.trialSessionId',
      )
      .leftJoin(
        'dwTrialSessionPaperPdf as tspdf',
        'tspdf.trialSessionId',
        'ts.trialSessionId',
      )
      .selectAll('ts')
      .select(({ fn }) => [
        fn
          .coalesce(
            fn
              .jsonAgg('tspdf')
              .distinct()
              .filterWhere('tspdf.trialSessionId', 'is not', null),
            sql`json_build_array()`,
          )
          .as('pdfs'),
        fn
          .coalesce(
            fn
              .jsonAgg('tsc')
              .distinct()
              .filterWhere('tsc.trialSessionId', 'is not', null),
            sql`json_build_array()`,
          )
          .as('caseOrders'),
      ])
      .orderBy('createdAt', 'desc')
      .groupBy(sql<string>`ts.*, ts.trial_session_id`)
      .execute(),
  );

  // PG JSON objects do not deserialize date strings into date objects.
  // This is different from selecting them directly in the main query, where they are deserialized into date objects.
  // This is a workaround to set those date strings as the expected objects before the move down stream.
  const deserializedTrialSessions = dbTrialSessions.map(trialSession => ({
    ...trialSession,
    caseOrders: trialSession.caseOrders.map(caseOrder => ({
      ...caseOrder,
      addedToSessionAt: caseOrder.addedToSessionAt
        ? calculateDate({
            dateString: caseOrder.addedToSessionAt,
          })
        : null,
      removedFromTrialDate: caseOrder.removedFromTrialDate
        ? calculateDate({
            dateString: caseOrder.removedFromTrialDate,
          })
        : null,
    })),
  }));

  return deserializedTrialSessions.map(ts =>
    fromKyselyTrialSession(ts, ts.pdfs as any, ts.caseOrders as any),
  );
};

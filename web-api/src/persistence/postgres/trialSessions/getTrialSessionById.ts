import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { getDbReader } from '@web-api/database';
import { fromKyselyTrialSession } from './mapper';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { TrialSessionCaseKysely } from '@web-api/persistence/postgres/trialSessions/schema';
import { sql } from 'kysely';

export const getTrialSessionById = async ({
  trialSessionId,
}: {
  trialSessionId: string;
}): Promise<RawTrialSession | undefined> => {
  const dbTrialSession = await getDbReader(reader =>
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
      .groupBy(sql<string>`ts.*, ts.trial_session_id`)
      .where('ts.trialSessionId', '=', trialSessionId)
      .executeTakeFirst(),
  );

  if (!dbTrialSession) {
    return undefined;
  }

  // PG JSON objects do not not deserialize date strings into date objects.
  // This is different from selecting them directly in the main query, where they are deserialized into date objects.
  // This is a workaround to set those date strings as the expected objects before the move down stream.
  const mappedCases: TrialSessionCaseKysely[] = dbTrialSession.caseOrders.map(
    caseOrder => ({
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
    }),
  ) as TrialSessionCaseKysely[];

  return fromKyselyTrialSession(
    dbTrialSession,
    dbTrialSession.pdfs as any,
    mappedCases,
  );
};

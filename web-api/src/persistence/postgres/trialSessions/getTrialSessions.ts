import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { getDbReader } from '@web-api/database';
import { fromKyselyTrialSession } from './mapper';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { calculateDate } from '@shared/business/utilities/DateHandler';

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
      .select(eb =>
        jsonArrayFrom(
          eb
            .selectFrom('dwTrialSessionCase as tsc')
            .selectAll() // Types WILL lie to us
            .whereRef('tsc.trialSessionId', '=', 'ts.trialSessionId'),
        ).as('caseOrders'),
      )
      .execute(),
  );

  // TODO jsonArrayFrom does not deserialize date strings into date objects.
  // This is different from selecting them directly in the main query, where they are deserialized into date objects.
  // This is a workaround to set those date strings as the expected objects before the move down stream.
  const deserializedTrialSessions = dbTrialSessions.map(trialSession => ({
    ...trialSession,
    caseOrders: trialSession.caseOrders.map(caseOrder => ({
      ...caseOrder,

      addedToSessionAt: calculateDate({
        dateString: caseOrder.addedToSessionAt as unknown as string,
      }),
      removedFromTrialDate: caseOrder.removedFromTrialDate
        ? calculateDate({
            dateString: caseOrder.removedFromTrialDate as unknown as string,
          })
        : null,
    })),
  }));

  return deserializedTrialSessions.map(ts =>
    fromKyselyTrialSession(ts, ts.pdfs, ts.caseOrders),
  );
};

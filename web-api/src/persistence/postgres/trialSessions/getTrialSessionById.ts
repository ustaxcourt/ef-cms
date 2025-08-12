import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { getDbReader } from '@web-api/database';
import { fromKyselyTrialSession } from './mapper';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { TrialSessionCaseKysely } from '@web-api/persistence/postgres/trialSessions/schema';

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
            .selectAll('tsc') // Dates will come back as strings
            .whereRef('tsc.trialSessionId', '=', 'ts.trialSessionId'),
        ).as('caseOrders'),
      )
      .where('trialSessionId', '=', trialSessionId)
      .executeTakeFirst(),
  );

  if (!dbTrialSession) {
    return undefined;
  }

  // TODO jsonArrayFrom does not deserialize date strings into date objects.
  // This is different from selecting them directly in the main query, where they are deserialized into date objects.
  // This is a workaround to set those date strings as the expected objects before the move down stream.
  const mappedCases: TrialSessionCaseKysely[] = dbTrialSession.caseOrders.map(
    caseOrder => ({
      ...caseOrder,

      addedToSessionAt: calculateDate({
        dateString: caseOrder.addedToSessionAt as unknown as string,
      }),
      removedFromTrialDate: caseOrder.removedFromTrialDate
        ? calculateDate({
            dateString: caseOrder.removedFromTrialDate as unknown as string,
          })
        : null,
    }),
  );

  return fromKyselyTrialSession(
    dbTrialSession,
    dbTrialSession.pdfs,
    mappedCases,
  );
};

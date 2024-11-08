import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import {
  caseDeadlineEntity,
  toKyselyNewCaseDeadline,
} from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { getDbWriter } from '@web-api/database';

export const upsertCaseDeadline = async ({
  caseDeadlineToUpsert,
}: {
  caseDeadlineToUpsert: RawCaseDeadline;
}) => {
  const caseDeadline = await getDbWriter(writer =>
    writer
      .insertInto('dwCaseDeadline')
      .values(toKyselyNewCaseDeadline(caseDeadlineToUpsert))
      .onConflict(oc =>
        oc
          .column('caseDeadlineId')
          .doUpdateSet(toKyselyNewCaseDeadline(caseDeadlineToUpsert)),
      )
      .returningAll()
      .executeTakeFirst(),
  );
  return caseDeadlineEntity(caseDeadline);
};

import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import {
  caseDeadlineEntity,
  toKyselyNewCaseDeadline,
} from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { getDbWriter } from '@web-api/database';

export const createCaseDeadline = async ({
  caseDeadline,
}: {
  caseDeadline: RawCaseDeadline;
}) => {
  const createdCaseDeadline = await getDbWriter(writer =>
    writer
      .insertInto('dwCaseDeadline')
      .values(toKyselyNewCaseDeadline(caseDeadline))
      .returningAll()
      .executeTakeFirst(),
  );
  return caseDeadlineEntity(createdCaseDeadline);
};

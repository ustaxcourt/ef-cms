import { caseDeadlines } from '@web-api/persistence/postgres/utils/seed/fixtures/caseDeadlines';
import { correspondence } from '@web-api/persistence/postgres/utils/seed/fixtures/correspodence';
import { getDbWriter } from '../../../../database';
import { messages } from './fixtures/messages';

export const seed = async () => {
  const insertMessages = getDbWriter(writer =>
    writer
      .insertInto('dwMessage')
      .values(messages)
      .onConflict(oc => oc.column('messageId').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );

  const insertCaseDeadline = getDbWriter(writer =>
    writer
      .insertInto('dwCaseDeadline')
      .values(caseDeadlines)
      .onConflict(oc => oc.column('caseDeadlineId').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );

  const insertCorrespondence = getDbWriter(writer =>
    writer
      .insertInto('dwCaseCorrespondence')
      .values(correspondence)
      .onConflict(oc => oc.column('correspondenceId').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );

  await Promise.all([insertMessages, insertCaseDeadline, insertCorrespondence]);
};

seed().catch;

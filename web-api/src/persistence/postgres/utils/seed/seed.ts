import { caseStatusUpdates } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/caseStatusUpdates';
import { cases } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases';
import { getDbWriter } from '../../../../database';
import { messages } from './fixtures/messages';
import {
  petitionerToCaseMappings,
  petitionerUsers,
} from '@web-api/persistence/postgres/utils/seed/fixtures/users/petitioners';
import { workItems } from './fixtures/workItems';

export const seed = async () => {
  await getDbWriter(writer =>
    writer
      .insertInto('dwMessage')
      .values(messages)
      .onConflict(oc => oc.column('messageId').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );

  await getDbWriter(writer =>
    writer
      .insertInto('dwWorkItem')
      .values(workItems)
      .onConflict(oc => oc.column('workItemId').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );

  // Seed the cases
  await getDbWriter(writer =>
    writer
      .insertInto('dwCase')
      .values(cases)
      .onConflict(oc => oc.column('docketNumber').doNothing())
      .execute(),
  );

  // Seed the case status updates
  await getDbWriter(writer =>
    writer
      .insertInto('dwCaseStatusUpdate')
      .values(caseStatusUpdates)
      .onConflict(oc => oc.columns(['docketNumber', 'date']).doNothing())
      .execute(),
  );

  // Seed the petitioners
  await getDbWriter(writer =>
    writer
      .insertInto('dwUser')
      .values(petitionerUsers)
      .onConflict(oc => oc.column('contactId').doNothing())
      .execute(),
  );

  // Attach petitioners to cases
  await getDbWriter(writer =>
    writer
      .insertInto('dwUserCase')
      .values(petitionerToCaseMappings)
      .onConflict(oc => oc.columns(['contactId', 'docketNumber']).doNothing())
      .execute(),
  );
};

seed().catch;

import { caseStatistics } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/caseStatistics';
import { caseStatusUpdates } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/caseStatusUpdates';
import { cases100_104 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases100_104';
import { cases105_109 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases105_109';
import { cases110_129 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases110_129';
import { cases130_309 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases130_309';
import { cases310_399 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases310_399';
import { cases400_409 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases400_409';
import { cases410_419 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases410_419';
import { cases420_429 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases420_429';
import { cases430_439 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases430_439';
import { cases440_449 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases440_449';
import { cases450_plus } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases450_plus';
import { getDbWriter } from '../../../../database';
import { messages } from './fixtures/messages';
import { petitionerToCaseMappings } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/petitionerToCaseMappings';
import { petitionerUsers } from '@web-api/persistence/postgres/utils/seed/fixtures/users/petitioners';
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
  const cases = [
    ...cases100_104,
    ...cases105_109,
    ...cases110_129,
    ...cases130_309,
    ...cases310_399,
    ...cases400_409,
    ...cases410_419,
    ...cases420_429,
    ...cases430_439,
    ...cases440_449,
    ...cases450_plus,
  ];
  await getDbWriter(writer =>
    writer
      .insertInto('dwCase')
      .values(cases)
      .onConflict(oc => oc.column('docketNumber').doNothing())
      .execute(),
  );

  // Attach the case status updates to their respective cases
  await getDbWriter(writer =>
    writer
      .insertInto('dwCaseStatusUpdate')
      .values(caseStatusUpdates)
      .onConflict(oc => oc.columns(['docketNumber', 'date']).doNothing())
      .execute(),
  );

  // Attach the case statistics to their respective cases
  await getDbWriter(writer =>
    writer
      .insertInto('dwCaseStatistic')
      .values(caseStatistics)
      .onConflict(oc => oc.column('statisticId').doNothing())
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

  // Attach petitioners to their respective cases
  await getDbWriter(writer =>
    writer
      .insertInto('dwUserCase')
      .values(petitionerToCaseMappings)
      .onConflict(oc => oc.columns(['contactId', 'docketNumber']).doNothing())
      .execute(),
  );
};

seed().catch;

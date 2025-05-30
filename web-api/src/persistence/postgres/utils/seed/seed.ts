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
import { caseDeadlines } from '@web-api/persistence/postgres/utils/seed/fixtures/caseDeadlines';
import { caseWorksheets } from '@web-api/persistence/postgres/utils/seed/fixtures/caseWorksheets';
import { correspondence } from '@web-api/persistence/postgres/utils/seed/fixtures/correspondence';
import { messages } from './fixtures/messages';
import { workItems } from './fixtures/workItems';
import { featureFlags } from '@web-api/persistence/postgres/utils/seed/fixtures/featureFlags';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { getDbWriter } from '@web-api/database';
import { Case } from '@shared/business/entities/cases/Case';

export const seed = async () => {
  const insertMessages = pgInsertInto({
    table: 'dwMessage',
    values: messages,
    onConflictColumns: ['messageId'],
  });

  const insertCaseDeadline = pgInsertInto({
    table: 'dwCaseDeadline',
    values: caseDeadlines,
    onConflictColumns: ['caseDeadlineId'],
  });

  const insertCorrespondence = pgInsertInto({
    table: 'dwCaseCorrespondence',
    values: correspondence,
    onConflictColumns: ['correspondenceId'],
  });

  const insertCaseWorksheet = pgInsertInto({
    table: 'dwCaseWorksheet',
    values: caseWorksheets,
    onConflictColumns: ['docketNumber'],
  });

  const insertWorkItem = await getDbWriter({
    cb: writer =>
      writer
        .insertInto('dwWorkItem')
        .values(workItems)
        .onConflict(oc => oc.column('workItemId').doNothing()) // ensure doesn't fail if exists
        .execute(),
    table: null,
  });

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
  await upsertCases(
    cases.map(c => ({
      ...c,
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: c.docketNumber,
        docketNumberSuffix: c.docketNumberSuffix,
      }),
    })),
  );

  const insertFeatureFlags = await pgInsertInto({
    table: 'dwFeatureFlag',
    values: featureFlags,
    onConflictColumns: ['name'],
  });

  await Promise.all([
    insertMessages,
    insertCaseDeadline,
    insertCorrespondence,
    insertCaseWorksheet,
    insertWorkItem,
    insertFeatureFlags,
  ]);
};

seed()
  .then(() => {
    console.log('Database data seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.log('Could not seed postgres data.');
    console.log(err);
    throw err;
  });

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
import { caseDeadlines } from '@web-api/persistence/postgres/utils/seed/fixtures/caseDeadlines';
import { caseWorksheets } from '@web-api/persistence/postgres/utils/seed/fixtures/caseWorksheets';
import { correspondence } from '@web-api/persistence/postgres/utils/seed/fixtures/correspodence';
import { getDbWriter } from '../../../../database';
import { messages } from './fixtures/messages';
import { petitionerToCaseMappings } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/petitionerToCaseMappings';
import { statisticPenalties } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/statisticPenalties';
import { workItems } from './fixtures/workItems';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getUniqueId } from '@shared/sharedAppContext';

export const seed = async () => {
  const insertMessages = getDbWriter({
    cb: writer =>
      writer
        .insertInto('dwMessage')
        .values(messages)
        .onConflict(oc => oc.column('messageId').doNothing()) // ensure doesn't fail if exists
        .execute(),
    table: null,
  });

  const insertCaseDeadline = getDbWriter({
    cb: writer =>
      writer
        .insertInto('dwCaseDeadline')
        .values(caseDeadlines)
        .onConflict(oc => oc.column('caseDeadlineId').doNothing()) // ensure doesn't fail if exists
        .execute(),
    table: null,
  });

  const insertCorrespondence = getDbWriter({
    cb: writer =>
      writer
        .insertInto('dwCaseCorrespondence')
        .values(correspondence)
        .onConflict(oc => oc.column('correspondenceId').doNothing()) // ensure doesn't fail if exists
        .execute(),
    table: null,
  });

  const insertCaseWorksheet = getDbWriter({
    cb: writer =>
      writer
        .insertInto('dwCaseWorksheet')
        .values(caseWorksheets)
        .onConflict(oc => oc.column('docketNumber').doNothing()) // ensure doesn't fail if exists
        .execute(),
    table: null,
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

  await getDbWriter({
    cb: writer =>
      writer
        .insertInto('dwPetitionerOnCase')
        .values(petitionerToCaseMappings)
        .onConflict(oc => oc.columns(['contactId', 'docketNumber']).doNothing())
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
  await upsertCases(cases);

  // Attach the case status updates to their respective cases
  await getDbWriter({
    cb: writer =>
      writer
        .insertInto('dwCaseStatusUpdate')
        .values(
          caseStatusUpdates.map(s => ({
            ...s,
            statusUpdateId: s.statusUpdateId ? s.statusUpdateId : getUniqueId(),
            date: calculateDate({ dateString: s.date }),
          })),
        )
        .onConflict(oc => oc.columns(['statusUpdateId']).doNothing())
        .execute(),
    table: null,
  });

  // Attach the case statistics to their respective cases
  await getDbWriter({
    cb: writer =>
      writer
        .insertInto('dwCaseStatistic')
        .values(caseStatistics)
        .onConflict(oc => oc.column('statisticId').doNothing())
        .execute(),
    table: null,
  });

  await getDbWriter({
    cb: writer =>
      writer
        .insertInto('dwStatisticPenalty')
        .values(statisticPenalties)
        .onConflict(oc => oc.column('penaltyId').doNothing())
        .execute(),
    table: null,
  });

  await Promise.all([
    insertMessages,
    insertCaseDeadline,
    insertCorrespondence,
    insertCaseWorksheet,
    insertWorkItem,
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
  });

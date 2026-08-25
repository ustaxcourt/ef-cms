#!/usr/bin/env -S npx ts-node --transpile-only

import {
  ScriptConfig,
  parseArgsAndEnvVars,
} from 'scripts/helpers/parseArgsAndEnvVars';
import { Case } from '@shared/business/entities/cases/Case';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';
import { settlePromises } from '@web-api/utilities/settlePromises';
import pLimit from 'p-limit';

const scriptConfig: ScriptConfig = {
  description:
    'Recomputes automaticBlocked on cases that were left blocked by the trial-date short circuit',
  environment: {
    env: 'ENV',
  },
  parameters: {
    dryRun: {
      default: false,
      short: 'd',
      type: 'boolean',
    },
  },
  requireActiveAwsSession: true,
};

const { dryRun } = parseArgsAndEnvVars(scriptConfig) as { dryRun: boolean };

const CASE_LOAD_BATCH_SIZE = 200;
const UPDATE_BATCH_SIZE = 500;
const CONCURRENCY_LIMIT = 10;

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const logProgress = (label: string, completed: number, total: number): void => {
  if (process.stdout.isTTY) {
    process.stdout.write(`\r${label}: ${completed}/${total}`);
    if (completed === total) process.stdout.write('\n');
  } else {
    console.log(`${label}: ${completed}/${total}`);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  // `pending` is a necessary condition for DocketEntry.isPending, so a case with no
  // pending-flagged entries and no deadlines is decidable without loading the case.
  const candidates = await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .where('c.automaticBlocked', '=', true)
      .select(eb => [
        'c.docketNumber',
        'c.trialDate',
        eb
          .exists(
            eb
              .selectFrom('dwCaseDeadline as d')
              .select('d.caseDeadlineId')
              .whereRef('d.docketNumber', '=', 'c.docketNumber'),
          )
          .as('hasDeadline'),
        eb
          .exists(
            eb
              .selectFrom('dwDocketEntry as de')
              .select('de.docketEntryId')
              .whereRef('de.docketNumber', '=', 'c.docketNumber')
              .where('de.pending', '=', true),
          )
          .as('hasPendingFlaggedEntry'),
      ])
      .execute(),
  );

  console.log(`Found ${candidates.length} automatically blocked cases.`);

  const definitelyUnblocked = candidates.filter(
    c => c.trialDate || (!c.hasDeadline && !c.hasPendingFlaggedEntry),
  );
  const needsEvaluation = candidates.filter(
    c => !c.trialDate && !c.hasDeadline && c.hasPendingFlaggedEntry,
  );

  console.log(
    `${definitelyUnblocked.length} resolved by query, ${needsEvaluation.length} require loading, ${candidates.length - definitelyUnblocked.length - needsEvaluation.length} still blocked.`,
  );

  const limit = pLimit(CONCURRENCY_LIMIT);
  const failedDocketNumbers: string[] = [];
  let evaluated = 0;

  const batches = chunk(
    needsEvaluation.map(c => c.docketNumber),
    CASE_LOAD_BATCH_SIZE,
  );

  const batchResults = await settlePromises(
    batches.map(batch =>
      limit(async (): Promise<string[]> => {
        try {
          const rawCases = await getCasesByDocketNumbers({
            docketNumbers: batch,
            excludeFields: ['correspondence', 'hearings', 'irsPractitioners'],
          });

          // The classifying query already established these cases have no deadlines.
          return rawCases
            .filter(
              rawCase =>
                !new Case(rawCase, {
                  authorizedUser: undefined,
                }).updateAutomaticBlocked({ hasCaseDeadline: false })
                  .automaticBlocked,
            )
            .map(rawCase => rawCase.docketNumber);
        } catch (e) {
          console.error('Failed to evaluate batch', {
            docketNumbers: batch,
            error: e,
          });
          failedDocketNumbers.push(...batch);
          return [];
        } finally {
          evaluated += batch.length;
          logProgress('Evaluated', evaluated, needsEvaluation.length);
        }
      }),
    ),
  );

  const staleDocketNumbers = [
    ...definitelyUnblocked.map(c => c.docketNumber),
    ...batchResults.flat(),
  ];

  console.log(
    `${staleDocketNumbers.length} cases are no longer automatically blocked.`,
  );

  if (failedDocketNumbers.length) {
    console.log('Failed to evaluate these cases:', failedDocketNumbers);
  }

  if (dryRun) {
    console.log('Dry run: no cases were updated.');
    return;
  }

  const updateBatches = chunk(staleDocketNumbers, UPDATE_BATCH_SIZE);
  let updated = 0;

  for (const batch of updateBatches) {
    await pgUpdateTable({
      table: 'dwCase',
      values: {
        automaticBlocked: false,
        automaticBlockedDate: null,
        automaticBlockedReason: null,
      },
      where: qb => qb.where('docketNumber', 'in', batch),
    });
    updated += batch.length;
    logProgress('Updated', updated, staleDocketNumbers.length);
  }

  console.log(`Finished! Updated ${staleDocketNumbers.length} cases.`);
})();

#!/usr/bin/env -S npx ts-node --transpile-only

import {
  ScriptConfig,
  parseArgsAndEnvVars,
} from 'scripts/helpers/parseArgsAndEnvVars';
import { Case } from '@shared/business/entities/cases/Case';
import { createApplicationContext } from '@web-api/applicationContext';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import pLimit from 'p-limit';
import { updateCaseAutomaticBlock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';

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
      long: 'dry-run',
      type: 'boolean',
    },
  },
  requireActiveAwsSession: true,
};

const { dryRun } = parseArgsAndEnvVars(scriptConfig) as { dryRun: boolean };

const CASE_LOAD_BATCH_SIZE = 200;
// withLocking does not forward retries to acquireLock, so keep batches small to limit collisions.
const UPDATE_BATCH_SIZE = 25;
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

const findStaleDocketNumbers = async ({
  docketNumbers,
  verbose = false,
}: {
  docketNumbers?: string[];
  verbose?: boolean;
}): Promise<{ stale: string[]; failed: string[]; total: number }> => {
  // `pending` is a necessary condition for DocketEntry.isPending, so a case with no
  // pending-flagged entries and no deadlines is decidable without loading the case.
  const candidates = await getDbReader(reader => {
    const blocked = reader
      .selectFrom('dwCase as c')
      .where('c.automaticBlocked', '=', true);

    const scoped = docketNumbers
      ? blocked.where('c.docketNumber', 'in', docketNumbers)
      : blocked;

    return scoped
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
      .execute();
  });

  const definitelyUnblocked = candidates.filter(
    c => c.trialDate || (!c.hasDeadline && !c.hasPendingFlaggedEntry),
  );
  const needsEvaluation = candidates.filter(
    c => !c.trialDate && !c.hasDeadline && c.hasPendingFlaggedEntry,
  );

  if (verbose) {
    console.log(`Found ${candidates.length} automatically blocked cases.`);
    console.log(
      `${definitelyUnblocked.length} resolved by query, ${needsEvaluation.length} require loading, ${candidates.length - definitelyUnblocked.length - needsEvaluation.length} still blocked.`,
    );
  }

  const limit = pLimit(CONCURRENCY_LIMIT);
  const failed: string[] = [];
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
          const evaluations = await Promise.all(
            rawCases.map(async rawCase => {
              const { automaticBlocked } = await updateCaseAutomaticBlock({
                caseEntity: new Case(rawCase, { authorizedUser: undefined }),
                hasCaseDeadline: false,
              });

              return { automaticBlocked, docketNumber: rawCase.docketNumber };
            }),
          );

          return evaluations
            .filter(evaluation => !evaluation.automaticBlocked)
            .map(evaluation => evaluation.docketNumber);
        } catch (e) {
          console.error('Failed to evaluate batch', {
            docketNumbers: batch,
            error: e,
          });
          failed.push(...batch);
          return [];
        } finally {
          evaluated += batch.length;
          if (verbose) {
            logProgress('Evaluated', evaluated, needsEvaluation.length);
          }
        }
      }),
    ),
  );

  return {
    failed,
    stale: [
      ...definitelyUnblocked.map(c => c.docketNumber),
      ...batchResults.flat(),
    ],
    total: candidates.length,
  };
};

const updateStaleCases = withLocking(
  async (
    _applicationContext,
    { docketNumbers }: { docketNumbers: string[] },
  ): Promise<number> => {
    // A case may have been re-blocked between the scan and now, so re-decide under lock.
    const { stale: stillStale } = await findStaleDocketNumbers({
      docketNumbers,
    });

    if (!stillStale.length) return 0;

    await pgUpdateTable({
      table: 'dwCase',
      values: {
        automaticBlocked: false,
        automaticBlockedDate: null,
        automaticBlockedReason: null,
      },
      where: qb => qb.where('docketNumber', 'in', stillStale),
    });

    return stillStale.length;
  },
  (_applicationContext, { docketNumbers }: { docketNumbers: string[] }) => ({
    // Sorted so concurrent runs acquire overlapping identifiers in the same order.
    identifiers: [...docketNumbers].sort().map(d => `case|${d}`),
  }),
);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  const { failed, stale, total } = await findStaleDocketNumbers({
    verbose: true,
  });

  console.log(
    `${stale.length} cases are no longer automatically blocked; ${total - stale.length} remain blocked.`,
  );

  if (failed.length) {
    console.log('Failed to evaluate these cases:', failed);
  }

  if (dryRun) {
    console.log('Dry run: no cases were updated.');
    return;
  }

  const updateBatches = chunk(stale, UPDATE_BATCH_SIZE);
  const skipped: string[] = [];
  let processed = 0;
  let updated = 0;

  for (const batch of updateBatches) {
    try {
      updated += await updateStaleCases(
        applicationContext,
        { docketNumbers: batch },
        undefined,
      );
    } catch (e) {
      console.error('Skipped batch; could not lock or update', {
        docketNumbers: batch,
        error: e,
      });
      skipped.push(...batch);
    }

    processed += batch.length;
    logProgress('Processed', processed, stale.length);
  }

  console.log(`Finished! Updated ${updated} cases.`);

  if (skipped.length) {
    console.log(`Skipped ${skipped.length} cases:`, skipped);
  }
})();

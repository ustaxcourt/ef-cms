#!/usr/bin/env -S npx ts-node --transpile-only

import { Case } from '@shared/business/entities/cases/Case';
import { createApplicationContext } from '@web-api/applicationContext';
import { updateCaseAutomaticBlock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { withTransaction } from '@web-api/persistence/postgres/utils/transactions';
import pLimit from 'p-limit';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';

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

const CONCURRENCY_LIMIT = 10;

const logProgress = (completed: number, total: number): void => {
  const percent = total ? Math.floor((completed / total) * 100) : 100;
  if (process.stdout.isTTY) {
    process.stdout.write(`\rProcessed: ${completed}/${total} (${percent}%)`);
    if (completed === total) process.stdout.write('\n');
  } else {
    console.log(`Processed: ${completed}/${total} (${percent}%)`);
  }
};

const findCasesWithAutomaticBlockedTrue = async () => {
  const candidates = await getDbReader(reader => {
    const blocked = reader
      .selectFrom('dwCase as c')
      .where('c.automaticBlocked', '=', true);

    return blocked.select(['c.docketNumber']).execute();
  });
  return candidates;
};

const updateCase = async (caseEntity: Case): Promise<Case> => {
  const updatedCase = await updateCaseAutomaticBlock({
    caseEntity: new Case(caseEntity, { authorizedUser: undefined }),
  });
  return updatedCase;
};

// Re-evaluates a single case under an advisory lock and persists the change if it is no longer blocked.
const updateCaseWithLocking = withLocking(
  async (
    _applicationContext,
    { docketNumber }: { docketNumber: string },
  ): Promise<boolean> => {
    const oldCase = await getCasesByDocketNumbers({
      docketNumbers: [docketNumber],
      excludeFields: ['correspondence', 'hearings', 'irsPractitioners'],
    })[0];
    const updatedCase = await updateCase(oldCase);

    if (dryRun) {
      return !updatedCase.automaticBlocked;
    }

    if (
      oldCase.automaticBlocked === updatedCase.automaticBlocked &&
      oldCase.automaticBlockedReason === updatedCase.automaticBlockedReason &&
      oldCase.hasPendingItems === updatedCase.hasPendingItems
    ) {
      return false;
    }

    await withTransaction(async () => {
      await pgUpdateTable({
        table: 'dwCase',
        values: {
          automaticBlocked: updatedCase.automaticBlocked,
          automaticBlockedDate: null,
          automaticBlockedReason: null,
          hasPendingItems: updatedCase.hasPendingItems,
        },
        where: qb => qb.where('docketNumber', '=', docketNumber),
      });
    });

    return true;
  },
  (_applicationContext, { docketNumber }: { docketNumber: string }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  const casesWithAutomaticBlockedTrue =
    await findCasesWithAutomaticBlockedTrue();

  console.log(
    'Number of cases with automatically blocked true: ',
    casesWithAutomaticBlockedTrue.length,
  );

  const limit = pLimit(CONCURRENCY_LIMIT);
  const failed: string[] = [];
  const total = casesWithAutomaticBlockedTrue.length;
  let updated = 0;
  let completed = 0;

  await settlePromises(
    casesWithAutomaticBlockedTrue.map(({ docketNumber }) =>
      limit(async () => {
        try {
          const wasUpdated = await updateCaseWithLocking(
            applicationContext,
            { docketNumber },
            undefined,
          );
          if (wasUpdated) updated++;
        } catch (e) {
          console.error(`Failed to update case ${docketNumber}`, e);
          failed.push(docketNumber);
        } finally {
          completed++;
          logProgress(completed, total);
        }
      }),
    ),
  );

  console.log(
    `${updated} cases were updated; ${failed.length} failed to update.`,
  );

  if (failed.length) {
    console.log('Failed to update these cases:', failed);
  }
})();

#!/usr/bin/env -S npx ts-node --transpile-only

import {
  ScriptConfig,
  parseArgsAndEnvVars,
} from 'scripts/helpers/parseArgsAndEnvVars';
import { Case } from '@shared/business/entities/cases/Case';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { updateCaseAutomaticBlock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
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

type StaleCase = {
  automaticBlockedReason?: string;
  docketNumber: string;
  trialDate?: string;
};

const CONCURRENCY_LIMIT = 10;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const blockedCases = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('automaticBlocked', '=', true)
      .where('docketNumber', '=', '380-20')
      .select(['docketNumber'])
      .execute(),
  );

  console.log(`Found ${blockedCases.length} automatically blocked cases.`);

  const limit = pLimit(CONCURRENCY_LIMIT);
  const failedDocketNumbers: string[] = [];

  const promises = blockedCases.map(({ docketNumber }) =>
    limit(async (): Promise<StaleCase | null> => {
      try {
        const rawCase = await getCaseByDocketNumber({
          docketNumber,
          includeConsolidatedCases: false,
        });

        const caseEntity = await updateCaseAutomaticBlock({
          caseEntity: new Case(rawCase, { authorizedUser: undefined }),
        });

        if (caseEntity.automaticBlocked) return null;

        return {
          automaticBlockedReason: rawCase.automaticBlockedReason,
          docketNumber,
          trialDate: rawCase.trialDate,
        };
      } catch (e) {
        failedDocketNumbers.push(docketNumber);
        return null;
      }
    }),
  );

  const staleCases = (await settlePromises(promises)).filter(
    (result): result is StaleCase => !!result,
  );

  console.log(
    `${staleCases.length} cases are no longer automatically blocked.`,
    staleCases,
  );

  if (failedDocketNumbers.length) {
    console.log('Failed to evaluate these cases:', failedDocketNumbers);
  }

  if (dryRun) {
    console.log('Dry run: no cases were updated.');
    return;
  }

  for (const staleCase of staleCases) {
    await pgUpdateTable({
      table: 'dwCase',
      values: {
        automaticBlocked: false,
        automaticBlockedDate: null,
        automaticBlockedReason: null,
      },
      where: qb => qb.where('docketNumber', '=', staleCase.docketNumber),
    });
  }

  console.log(`Finished! Updated ${staleCases.length} cases.`);
})();

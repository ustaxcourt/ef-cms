#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

const scriptConfig: ScriptConfig = {
  description: 'check for invalid multiDocketedOn arrays',
  environment: {
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const multiDocketedOnArrays = async () => {
  return await getDbReader(reader =>
    reader
      .selectFrom(
        reader
          .selectFrom('dwDocketEntry')
          .select([
            sql<string[]>`array_agg(docket_number order by docket_number)`.as(
              'multiDocketedOn',
            ),
          ])
          .groupBy('docketEntryId')
          .having(reader.fn.count('docketEntryId'), '>', 1)
          .as('subquery'),
      )
      .select('multiDocketedOn')
      .distinct()
      .execute(),
  );
};

const invalidMultiDocketedOnArrays = async rowsOfMultiDocketed => {
  const invalidRows: {
    multiDocketedOn: string[];
  }[] = [];

  for (const row of rowsOfMultiDocketed) {
    const docketNumbers: string[] = row.multiDocketedOn;

    const cases = await getDbReader(reader =>
      reader
        .selectFrom('dwCase')
        .select(['docketNumber', 'leadDocketNumber'])
        .where('docketNumber', 'in', docketNumbers)
        .execute(),
    );

    for (const aCase of cases) {
      if (
        !aCase.leadDocketNumber ||
        !row.multiDocketedOn.includes(aCase.leadDocketNumber)
      ) {
        invalidRows.push(row);
        break;
      }
    }
  }

  return invalidRows;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const rowsOfMultiDocketed = await multiDocketedOnArrays();
  const invalidRows = await invalidMultiDocketedOnArrays(rowsOfMultiDocketed);

  console.log('***Invalid MultiDocketedOn Arrays: ', invalidRows);
  console.log('***Invalid MultiDocketedOn Arrays length: ', invalidRows.length);
})();

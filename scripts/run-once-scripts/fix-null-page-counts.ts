#!/usr/bin/env -S npx ts-node --transpile-only

import { createApplicationContext } from '@web-api/applicationContext';
import { getDbReader, getDbWriter } from '@web-api/database';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { sql } from 'kysely';
import pLimit from 'p-limit';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description:
    'Fixes issues with docket entries that do not have the number of pages set',
  environment: {
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};

parseArgsAndEnvVars(scriptConfig);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  console.log('Starting...');
  const applicationContext = createApplicationContext({});

  const docketEntries = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .where('isFileAttached', '=', true)
      .where('numberOfPages', 'is', null)
      .where('servedAt', 'is not', null)
      .select(['docketNumber', 'docketEntryId'])
      .execute(),
  );

  console.log(
    'Got list of docket entries to update, count: ',
    docketEntries.length,
  );

  const CONCURRENCY_LIMIT = 10;
  const limit = pLimit(CONCURRENCY_LIMIT);

  const promises: Promise<any>[] = [];
  const failedDocketEntryIds: string[] = [];

  docketEntries.forEach((docketEntry, i) => {
    promises.push(
      limit(async () => {
        try {
          console.log('Pulling docket entry: ', i, docketEntry.docketEntryId);
          const numberOfPages = await applicationContext
            .getUseCaseHelpers()
            .countPagesInDocument({
              applicationContext,
              docketEntryId: docketEntry.docketEntryId,
            });
          return {
            ...docketEntry,
            numberOfPages: numberOfPages,
          };
        } catch (e) {
          failedDocketEntryIds.push(docketEntry.docketEntryId);
        }
      }),
    );
  });

  let results = await settlePromises(promises);
  results = results.filter(result => result);

  console.log(
    'Got page number counts for all documents, count:',
    results.length,
    failedDocketEntryIds,
  );

  const valuesString = results
    .map(entry => {
      return `('${entry.docketNumber}', '${entry.docketEntryId}', ${entry.numberOfPages})`;
    })
    .join(', ');

  const valuesListString = `(values ${valuesString})`;
  const valuesList = sql<{
    column1: string;
    column2: string;
    column3: number;
  }>`${sql.raw(valuesListString)}`.as('valuesList');

  await getDbWriter({
    cb: writer =>
      writer
        .mergeInto('dwDocketEntry as d')
        .using(valuesList,
          join =>
            join
              .onRef('valuesList.column2', '=', 'd.docketEntryId')
              .onRef('valuesList.column1', '=', 'd.docketNumber'),
        )
        .whenMatched()
        .thenUpdate(update =>
          update.set(set => ({
            numberOfPages: set.ref('valuesList.column3'),
          })),
        )
        .execute(),
    table: 'dwDocketEntry',
    action: 'UPSERT',
  });

  console.log('Finished!');
})();

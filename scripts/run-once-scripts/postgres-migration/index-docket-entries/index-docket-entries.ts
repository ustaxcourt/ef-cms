#!/usr/bin/env -S npx ts-node --transpile-only

import { calculateDate } from '@shared/business/utilities/DateHandler';
import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { spawn } from 'child_process';
import { CompiledQuery } from 'kysely';

const scriptConfig: ScriptConfig = {
  description:
    'index-docket-entries: a script to re-index docket entries from Postgres to OpenSearch',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  parameters: {
    num_processes: {
      position: 0,
      required: true,
      transform: 'toLowerCase',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { num_processes } = parseArgsAndEnvVars(scriptConfig) as {
  num_processes: string;
};

/*
This script partitions docket entries into N (= num_processes argument) equal groups and kicks off a separate process
to index each group.
*/
async function main() {
  const count = await getDocketEntriesCount();

  const numProcesses = Number(num_processes);

  console.log(`Calculating chunk sizes for ${numProcesses} processes`);
  const chunkSize = Math.ceil(count / numProcesses);
  console.log(`Chunk size: ${chunkSize}`);

  const offsets: number[] = [];
  for (let i = 0; i <= count; i += chunkSize) {
    offsets.push(i);
  }
  console.log('Chunk indices: ', offsets);

  const dateIntervals = await getDateIntervals(offsets);

  for (const dateInterval of dateIntervals) {
    console.log('Kicking off process for date range', dateInterval);
    const child = spawn(
      'npx',
      [
        'ts-node',
        '--transpile-only',
        './scripts/run-once-scripts/postgres-migration/index-docket-entries/_index-docket-entries-child.ts',
        dateInterval[0].toISOString(),
        dateInterval[1].toISOString(),
      ],
      {
        env: {
          ...process.env,
          NODE_ENV: 'production',
        },
      },
    );

    child.stdout.on('data', data => {
      console.log(`[stdout] ${data.toString()}`);
    });

    child.stderr.on('data', data => {
      console.error(`[stderr] ${data.toString()}`);
    });

    child.on('close', code => {
      console.log(`Child process exited with code ${code}`);
    });
  }
  console.log(`Kicked off ${numProcesses} processes`);
}

async function getDocketEntriesCount() {
  console.log('Getting the number of docket entries');
  const countQuery = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .select(reader.fn.countAll().as('count'))
      .executeTakeFirst(),
  );

  // In a perfect world, we would not need paddingToAccountForNewData: new data will already be indexed,
  // and it *should* have a createdAt of now(), putting it at the end of our sort. In other words,
  // if X new docket entries come in, we still only need to index the first N, not N+X.
  // However, in app code, docket entry createdAt is, inexplicably, not always set to now(). This is sad.
  // So we added a constant factor that says, "Index all N of your existing docket entries ... plus a small
  // batch extra, just in case we got a bunch of new docket entries with an older date that threw off our
  // offsets."
  const paddingToAccountForNewData = 1000;
  const count = Number(countQuery?.count) + paddingToAccountForNewData;
  console.log(
    `Number of docket entries: ${count} (plus ${paddingToAccountForNewData} extra padding to deal with an edge case)`,
  );
  return count;
}

async function getDateIntervals(offsets: number[]) {
  console.log(
    'Getting date ranges corresponding to chunk indices (this can take a minute as it needs to sort millions of records)',
  );
  const rows = await getChunkDates(offsets);
  // Build intervals from the dates we got
  const updatedRows: Date[] = [
    calculateDate({ dateString: '0000-01-01' }),
    ...rows.map(r => r.createdAt),
    calculateDate({ dateString: '5000-01-01' }),
  ];
  const chunkedDates: Date[][] = [];
  for (let i = 1; i <= updatedRows.length - 1; i++) {
    chunkedDates.push([updatedRows[i - 1], updatedRows[i]]);
  }
  console.log('Date ranges: ', chunkedDates);
  return chunkedDates;
}

async function getChunkDates(offsets: number[]) {
  // This function sorts the docket entries and adds the row number to each row.
  // Then we get each createdAt date corresponding to each chunk index = row number.
  return (
    // Just using a Postgres query directly rather than fiddling with kysely
    (
      await getDbReader(reader =>
        reader.executeQuery(
          CompiledQuery.raw(
            `SELECT
        created_at
        FROM (
          SELECT
            created_at,
            ROW_NUMBER() OVER (
              ORDER BY 
              created_at,
              docket_number,
              docket_entry_id             
            ) AS rn
          FROM dw_docket_entry
        ) AS numbered_entries
        WHERE rn IN (${offsets});`,
          ),
        ),
      )
    ).rows as unknown as { createdAt: Date }[]
  );
}

main().catch(console.error);

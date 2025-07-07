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

// ts-node script.ts --num-processes 5 [--offset X --partitionSize Y]

// We will count all docket entries. Call this n.
// Unfortunately, createdAt lies. To handle this, we will set N = n + 1000
// We will partition these into baskets of count / N (ceiling/floor), sorted by createdAt
// It doesn't matter if more come in during this:
//   these should already be indexed
//   we have the buffer of 1000 in case they affect the offset such that we would miss existing data at the end of our sort
// In other words, if we only index n and there are now N + X, those X will already be indexed
// Done!

// sort the table once
// at each offset (calculated by num processes), get the createdAt
// pass those createdAt dates into the child processes, which will function as the where query bounds

async function getDocketEntriesCount() {
  const countQuery = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .select(reader.fn.countAll().as('count'))
      .executeTakeFirst(),
  );
  return Number(countQuery?.count) + 1000; // TODO: add comment explaining this
}

// get earliest date
// get latest date
// divide

async function getChunks(offsets: number[]) {
  return (
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
  ).rows as unknown as { createdAt: Date }[];
}

async function getDateChunks(offsets: number[]) {
  const rows = await getChunks(offsets);
  console.log('rows', rows);

  const updatedRows: Date[] = [
    calculateDate({ dateString: '0000-01-01' }),
    ...rows.map(r => r.createdAt),
    calculateDate({ dateString: '5000-01-01' }),
  ];
  const chunkedDates: Date[][] = [];
  for (let i = 1; i <= updatedRows.length - 1; i++) {
    chunkedDates.push([updatedRows[i - 1], updatedRows[i]]);
  }
  return chunkedDates;
}

async function main() {
  // If not offset, kick off the tasks
  const count = await getDocketEntriesCount();
  console.log('Number of docket entries', count);
  const numProcesses = Number(num_processes);
  console.log('Number of processes', numProcesses);
  const partitionSize = Math.ceil(count / numProcesses);
  const offsets: number[] = [];
  for (let i = 0; i <= count; i += partitionSize) {
    offsets.push(i);
  }
  console.log('offsets', offsets);
  const dateChunks = await getDateChunks(offsets);
  console.log('dateChunks', dateChunks);

  for (const dateChunk of dateChunks) {
    console.log('DOING THE THING');
    const child = spawn(
      'npx',
      [
        'ts-node',
        '--transpile-only',
        './scripts/run-once-scripts/postgres-migration/index-docket-entries/_index-docket-entries-child.ts',
        dateChunk[0].toISOString(),
        dateChunk[1].toISOString(),
      ],
      {
        // stdio: 'pipe',
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
}

main().catch(console.error);

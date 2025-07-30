#!/usr/bin/env -S npx ts-node --transpile-only

import { calculateDate } from '@shared/business/utilities/DateHandler';
import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { spawn } from 'child_process';
import { CompiledQuery } from 'kysely';

const scriptConfig: ScriptConfig = {
  description:
    'index-cases: a script to re-index cases from Postgres to OpenSearch',
  environment: {
    env: 'ENV',
    elasticSearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
  },
  parameters: {
    numProcesses: {
      position: 0,
      required: true,
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { numProcesses } = parseArgsAndEnvVars(scriptConfig) as {
  numProcesses: number;
};

/*
This script partitions cases into N (= num_processes argument) equal groups and kicks off a separate process
to index each group.
*/
async function main() {
  const count = await getCasesCount();

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
        './scripts/reindex/index-cases/_index-cases-child.ts',
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

async function getCasesCount() {
  console.log('Getting the number of cases');
  const countQuery = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .select(reader.fn.countAll().as('count'))
      .executeTakeFirst(),
  );

  const count = Number(countQuery?.count);
  console.log(`Number of cases: ${count}`);
  return count;
}

async function getDateIntervals(offsets: number[]) {
  console.log(
    'Getting date ranges corresponding to chunk indices (this can take a minute as it needs to sort > 1 million records)',
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
  // This function sorts the cases and adds the row number to each row.
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
              docket_number         
            ) AS rn
          FROM dw_case
        ) AS numbered_cases
        WHERE rn IN (${offsets});`,
          ),
        ),
      )
    ).rows as unknown as { createdAt: Date }[]
  );
}

main().catch(console.error);

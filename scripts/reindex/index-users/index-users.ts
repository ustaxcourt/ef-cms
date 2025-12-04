#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { spawn } from 'child_process';
import { CompiledQuery } from 'kysely';

const scriptConfig: ScriptConfig = {
  description:
    'index-users: a script to re-index users from Postgres to OpenSearch',
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
This script partitions users into N (= num_processes argument) equal groups and kicks off a separate process
to index each group.
*/
async function main() {
  const count = await getUsersCount();

  console.log(`Calculating chunk sizes for ${numProcesses} processes`);
  const chunkSize = Math.ceil(count / numProcesses);
  console.log(`Chunk size: ${chunkSize}`);

  const offsets: number[] = [];
  for (let i = 0; i <= count; i += chunkSize) {
    offsets.push(i);
  }
  console.log('Chunk indices: ', offsets);

  const idIntervals = await getUserIdIntervals(offsets);

  for (const idInterval of idIntervals) {
    console.log('Kicking off process for userId range', idInterval);
    const child = spawn(
      'npx',
      [
        'ts-node',
        '--transpile-only',
        './scripts/reindex/index-users/_index-users-child.ts',
        idInterval[0],
        idInterval[1],
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

async function getUsersCount() {
  console.log('Getting the number of users');
  const countQuery = await getDbReader(reader =>
    reader
      .selectFrom('dwUser')
      .select(reader.fn.countAll().as('count'))
      .executeTakeFirst(),
  );

  const count = Number(countQuery?.count);
  console.log(`Number of users: ${count}`);
  return count;
}

async function getUserIdIntervals(offsets: number[]) {
  console.log(
    'Getting userId ranges corresponding to chunk indices',
  );
  const rows = await getChunkUserIds(offsets);
  // Build intervals from the ids we got
  const updatedRows: string[] = ['__MIN__'];
  updatedRows.push(...rows.map(r => r.userId));
  updatedRows.push('__MAX__');

  const chunkedIds: string[][] = [];
  for (let i = 1; i <= updatedRows.length - 1; i++) {
    chunkedIds.push([updatedRows[i - 1], updatedRows[i]]);
  }
  console.log('UserId ranges: ', chunkedIds);
  return chunkedIds;
}

async function getChunkUserIds(offsets: number[]) {
  // This function sorts the users and adds the row number to each row.
  // Then we get each userId corresponding to each chunk index = row number.
  return (
    await getDbReader(reader =>
      reader.executeQuery(
        CompiledQuery.raw(
          `SELECT
            user_id as "userId"
          FROM (
            SELECT
              user_id,
              ROW_NUMBER() OVER (ORDER BY user_id) AS rn
            FROM dw_user
          ) AS numbered
          WHERE rn IN (${offsets});`,
        ),
      ),
    )
  ).rows as unknown as { userId: string }[];
}


main().catch(console.error);



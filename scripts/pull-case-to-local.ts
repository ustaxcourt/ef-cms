#!/usr/bin/env -S npx ts-node --transpile-only

// Usage: ENV=<source-env> ./scripts/pull-case-to-local.ts -d <docket-number>
//
// Pulls a case and all related records from a remote test database
// and inserts them into the local development database.
//
// Prerequisites:
//   - Active AWS session for the source environment
//   - Local postgres running (docker-compose up)
//   - Local s3rver running (npm run start:s3rver)
//   - global-bundle.pem in the repo root

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from './helpers/parseArgsAndEnvVars';
import { Signer } from '@aws-sdk/rds-signer';
import { DescribeDBClustersCommand, RDSClient } from '@aws-sdk/client-rds';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const scriptConfig: ScriptConfig = {
  description:
    'Pull a case and all related records from a remote database into the local database',
  environment: {
    env: 'ENV',
  },
  parameters: {
    docketNumber: {
      required: true,
      short: 'd',
      type: 'string',
      description: 'The docket number of the case to pull (e.g., 16017-21)',
    },
    skipS3: {
      default: false,
      type: 'boolean',
      description: 'Skip copying S3 document fixtures',
    },
  },
  requireActiveAwsSession: true,
};

const { env, docketNumber, skipS3, verbose } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  env: string;
  docketNumber: string;
  skipS3: boolean;
  verbose: boolean;
};

const S3_FIXTURE_DIR = path.join(
  __dirname,
  '..',
  'web-api',
  'storage',
  'fixtures',
  's3',
  'noop-documents-local-us-east-1',
);

const S3_LOCAL_DIR = path.join(
  __dirname,
  '..',
  'web-api',
  'storage',
  's3',
  'noop-documents-local-us-east-1',
);

async function getSourceConnection(): Promise<Pool> {
  const rdsClient = new RDSClient({ region: 'us-east-1' });
  const clusterIdentifier = `${env}-dawson-cluster`;
  const command = new DescribeDBClustersCommand({
    DBClusterIdentifier: clusterIdentifier,
  });
  const describeResponse = await rdsClient.send(command);
  const dbCluster = describeResponse.DBClusters?.[0];

  if (!dbCluster) {
    throw new Error(`Could not find RDS cluster: ${clusterIdentifier}`);
  }

  const host = dbCluster.ReaderEndpoint!;
  const port = dbCluster.Port!;
  const dbName = dbCluster.DatabaseName!;
  const username = `${env}_dawson`;

  const signer = new Signer({
    hostname: host,
    port,
    region: 'us-east-1',
    username,
  });

  const password = await signer.getAuthToken();

  const certPath = path.join(__dirname, '..', 'global-bundle.pem');
  if (!fs.existsSync(certPath)) {
    throw new Error(
      `global-bundle.pem not found at ${certPath}. Download it from AWS.`,
    );
  }

  return new Pool({
    host,
    port,
    database: dbName,
    user: username,
    password,
    ssl: { ca: fs.readFileSync(certPath).toString() },
    max: 1,
  });
}

function getLocalConnection(): Pool {
  return new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'example',
    max: 1,
  });
}

async function queryAll(
  pool: Pool,
  table: string,
  whereClause: string,
  params: any[],
): Promise<{ rows: any[]; columns: string[] }> {
  const result = await pool.query(
    `SELECT * FROM "${table}" WHERE ${whereClause}`,
    params,
  );
  const columns = result.fields.map(f => f.name);
  return { rows: result.rows, columns };
}

function collectUserIds(...rowSets: { rows: any[]; fields: string[] }[]): string[] {
  const userIds = new Set<string>();
  for (const { rows, fields } of rowSets) {
    for (const row of rows) {
      for (const field of fields) {
        if (row[field] && typeof row[field] === 'string') {
          userIds.add(row[field]);
        }
      }
    }
  }
  return [...userIds];
}

async function batchInsert(
  queryable: { query: (sql: string, params: any[]) => Promise<any> },
  table: string,
  columns: string[],
  rows: any[],
  onConflict: string = '',
  batchSize: number = 100,
): Promise<number> {
  if (rows.length === 0) return 0;

  let inserted = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const valuePlaceholders: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    for (const row of batch) {
      const rowPlaceholders: string[] = [];
      for (const col of columns) {
        const value = row[col];
        if (value !== undefined && typeof value === 'object' && value !== null && !(value instanceof Date)) {
          params.push(JSON.stringify(value));
        } else {
          params.push(value === undefined ? null : value);
        }
        rowPlaceholders.push(`$${paramIndex++}`);
      }
      valuePlaceholders.push(`(${rowPlaceholders.join(', ')})`);
    }

    const quotedColumns = columns.map(c => `"${c}"`).join(', ');
    const sql = `INSERT INTO "${table}" (${quotedColumns}) VALUES ${valuePlaceholders.join(', ')} ${onConflict}`;

    await queryable.query(sql, params);
    inserted += batch.length;
  }
  return inserted;
}

function findSeedDocumentId(): string | null {
  if (!fs.existsSync(S3_FIXTURE_DIR)) return null;
  const files = fs.readdirSync(S3_FIXTURE_DIR);
  const objectFile = files.find(f => f.endsWith('._S3rver_object'));
  if (!objectFile) return null;
  return objectFile.replace('._S3rver_object', '');
}

function copyS3Fixture(seedDocId: string, targetDocId: string): void {
  const suffixes = [
    '._S3rver_metadata.json',
    '._S3rver_object',
    '._S3rver_object.md5',
  ];

  if (!fs.existsSync(S3_LOCAL_DIR)) {
    fs.mkdirSync(S3_LOCAL_DIR, { recursive: true });
  }

  for (const suffix of suffixes) {
    const sourcePath = path.join(S3_FIXTURE_DIR, `${seedDocId}${suffix}`);
    const targetPath = path.join(S3_LOCAL_DIR, `${targetDocId}${suffix}`);

    if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  console.log('\n--- PULL CASE TO LOCAL ---');
  console.log(`  Source Environment: ${env}`);
  console.log(`  Docket Number:     ${docketNumber}`);
  console.log(`  Skip S3:           ${skipS3}`);
  console.log('');

  let sourcePool: Pool | null = null;
  let localPool: Pool | null = null;

  try {
    // Step 1: Connect to source
    console.log('Step 1: Connecting to source database...');
    sourcePool = await getSourceConnection();
    await sourcePool.query('SELECT 1');
    console.log('  Connected to source.');

    // Step 2: Pull case record
    console.log('\nStep 2: Pulling case data...');
    const caseData = await queryAll(sourcePool, 'dw_case', '"docket_number" = $1', [docketNumber]);
    if (caseData.rows.length === 0) {
      throw new Error(`Case ${docketNumber} not found in source database.`);
    }
    console.log(`  Case: ${docketNumber} (${caseData.rows[0].status})`);

    // Step 3: Pull related records
    console.log('\nStep 3: Pulling related records...');

    const [
      docketEntries,
      userOnCase,
      userOnCasePending,
      workItems,
      messages,
      correspondence,
      relatedDocketEntries,
    ] = await Promise.all([
      queryAll(sourcePool, 'dw_docket_entry', '"docket_number" = $1', [docketNumber]),
      queryAll(sourcePool, 'dw_user_on_case', '"docket_number" = $1', [docketNumber]),
      queryAll(sourcePool, 'dw_user_on_case_pending', '"docket_number" = $1', [docketNumber]),
      queryAll(sourcePool, 'dw_work_item', '"docket_number" = $1', [docketNumber]),
      queryAll(sourcePool, 'dw_message', '"docket_number" = $1', [docketNumber]),
      queryAll(sourcePool, 'dw_case_correspondence', '"docket_number" = $1', [docketNumber]),
      queryAll(sourcePool, 'dw_docket_entry_related_docket_entry', '"docket_number" = $1', [docketNumber]),
    ]);

    console.log(`  Docket Entries:             ${docketEntries.rows.length}`);
    console.log(`  Users on Case:              ${userOnCase.rows.length}`);
    console.log(`  Users on Case (Pending):    ${userOnCasePending.rows.length}`);
    console.log(`  Work Items:                 ${workItems.rows.length}`);
    console.log(`  Messages:                   ${messages.rows.length}`);
    console.log(`  Correspondence:             ${correspondence.rows.length}`);
    console.log(`  Related Docket Entries:     ${relatedDocketEntries.rows.length}`);

    // Pull trial session if the case references one
    let trialSession = { rows: [] as any[], columns: [] as string[] };
    let trialSessionCases = { rows: [] as any[], columns: [] as string[] };
    const trialSessionId = caseData.rows[0].trial_session_id;
    if (trialSessionId) {
      console.log(`  Pulling trial session:      ${trialSessionId}`);
      [trialSession, trialSessionCases] = await Promise.all([
        queryAll(sourcePool, 'dw_trial_session', '"trial_session_id" = $1', [trialSessionId]),
        queryAll(sourcePool, 'dw_trial_session_case', '"trial_session_id" = $1', [trialSessionId]),
      ]);
      console.log(`  Trial Session:              ${trialSession.rows.length}`);
      console.log(`  Trial Session Cases:        ${trialSessionCases.rows.length}`);
    }

    // Step 4: Collect and pull referenced users
    console.log('\nStep 4: Pulling referenced users...');
    const userIds = collectUserIds(
      { rows: caseData.rows, fields: ['associated_judge_id'] },
      { rows: docketEntries.rows, fields: ['user_id', 'signed_by_user_id', 'stricken_by_user_id'] },
      { rows: userOnCase.rows, fields: ['user_id'] },
      { rows: userOnCasePending.rows, fields: ['user_id'] },
      { rows: workItems.rows, fields: ['assignee_id', 'sent_by_user_id', 'completed_by_user_id'] },
      { rows: messages.rows, fields: ['from_user_id', 'to_user_id'] },
      { rows: correspondence.rows, fields: ['user_id'] },
      { rows: trialSession.rows, fields: ['judge_user_id', 'trial_clerk_user_id'] },
    );

    let users = { rows: [] as any[], columns: [] as string[] };
    if (userIds.length > 0) {
      const placeholders = userIds.map((_, i) => `$${i + 1}`).join(', ');
      users = await queryAll(sourcePool, 'dw_user', `"user_id" IN (${placeholders})`, userIds);
    }
    console.log(`  Users:                      ${users.rows.length} (from ${userIds.length} unique IDs)`);

    // Step 5: Insert into local database
    console.log('\nStep 5: Inserting into local database...');
    localPool = getLocalConnection();
    await localPool.query('SELECT 1');
    console.log('  Connected to local database.');

    const client = await localPool.connect();
    try {
      await client.query('BEGIN');

      // Delete existing records for this docket number (in reverse dependency order)
      console.log('  Deleting existing records for this docket number...');
      const tablesToDelete = [
        'dw_docket_entry_related_docket_entry',
        'dw_case_correspondence',
        'dw_message',
        'dw_work_item',
        'dw_user_on_case_pending',
        'dw_user_on_case',
        'dw_docket_entry',
        'dw_case',
      ];

      for (const table of tablesToDelete) {
        await client.query(`DELETE FROM "${table}" WHERE "docket_number" = $1`, [docketNumber]);
      }

      // Insert in dependency order
      // Users first (upsert - don't overwrite existing)
      if (users.rows.length > 0) {
        const count = await batchInsert(
          client,
          'dw_user',
          users.columns,
          users.rows,
          'ON CONFLICT ("user_id") DO NOTHING',
        );
        console.log(`  Inserted users:                      ${count} (skipped existing)`);
      }

      // Trial session (before case, since case FK references it)
      if (trialSession.rows.length > 0) {
        await batchInsert(
          client,
          'dw_trial_session',
          trialSession.columns,
          trialSession.rows,
          'ON CONFLICT ("trial_session_id") DO NOTHING',
        );
        console.log(`  Inserted trial session:              ${trialSession.rows.length}`);
      }

      // Case
      await batchInsert(client, 'dw_case', caseData.columns, caseData.rows);
      console.log(`  Inserted case:                       1`);

      // Trial session cases (after case, since it references both)
      if (trialSessionCases.rows.length > 0) {
        await batchInsert(
          client,
          'dw_trial_session_case',
          trialSessionCases.columns,
          trialSessionCases.rows,
          'ON CONFLICT ("trial_session_id", "docket_number") DO NOTHING',
        );
        console.log(`  Inserted trial session cases:        ${trialSessionCases.rows.length}`);
      }

      // Docket entries
      if (docketEntries.rows.length > 0) {
        const count = await batchInsert(
          client,
          'dw_docket_entry',
          docketEntries.columns,
          docketEntries.rows,
        );
        console.log(`  Inserted docket entries:             ${count}`);
      }

      // User on case
      if (userOnCase.rows.length > 0) {
        const count = await batchInsert(
          client,
          'dw_user_on_case',
          userOnCase.columns,
          userOnCase.rows,
        );
        console.log(`  Inserted users on case:              ${count}`);
      }

      // User on case pending
      if (userOnCasePending.rows.length > 0) {
        const count = await batchInsert(
          client,
          'dw_user_on_case_pending',
          userOnCasePending.columns,
          userOnCasePending.rows,
        );
        console.log(`  Inserted users on case (pending):    ${count}`);
      }

      // Work items
      if (workItems.rows.length > 0) {
        const count = await batchInsert(
          client,
          'dw_work_item',
          workItems.columns,
          workItems.rows,
        );
        console.log(`  Inserted work items:                 ${count}`);
      }

      // Messages
      if (messages.rows.length > 0) {
        const count = await batchInsert(
          client,
          'dw_message',
          messages.columns,
          messages.rows,
        );
        console.log(`  Inserted messages:                   ${count}`);
      }

      // Correspondence
      if (correspondence.rows.length > 0) {
        const count = await batchInsert(
          client,
          'dw_case_correspondence',
          correspondence.columns,
          correspondence.rows,
        );
        console.log(`  Inserted correspondence:             ${count}`);
      }

      // Related docket entries
      if (relatedDocketEntries.rows.length > 0) {
        const count = await batchInsert(
          client,
          'dw_docket_entry_related_docket_entry',
          relatedDocketEntries.columns,
          relatedDocketEntries.rows,
        );
        console.log(`  Inserted related docket entries:     ${count}`);
      }

      await client.query('COMMIT');
      console.log('  Transaction committed.');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    // Step 6: Handle S3 documents
    if (!skipS3) {
      console.log('\nStep 6: Setting up S3 document fixtures...');
      const seedDocId = findSeedDocumentId();
      if (!seedDocId) {
        console.log('  WARNING: No seed S3 fixture found. Skipping S3 setup.');
        console.log('  Documents will not be viewable. Run with --skip-s3 to suppress this warning.');
      } else {
        const docStorageIds = docketEntries.rows
          .filter(r => r.is_file_attached && r.document_storage_id)
          .map(r => r.document_storage_id as string);

        const uniqueDocIds = [...new Set(docStorageIds)];
        console.log(`  Seed document: ${seedDocId}`);
        console.log(`  Documents to create: ${uniqueDocIds.length}`);

        let created = 0;
        for (const docId of uniqueDocIds) {
          copyS3Fixture(seedDocId, docId);
          created++;
          if (created % 500 === 0) {
            console.log(`  Progress: ${created}/${uniqueDocIds.length}`);
          }
        }
        console.log(`  Created ${created} S3 document fixtures.`);
      }
    } else {
      console.log('\nStep 6: Skipping S3 document fixtures (--skip-s3).');
    }

    // Summary
    console.log('\n--- COMPLETE ---');
    console.log(`  Case ${docketNumber} has been pulled from ${env} into your local database.`);
    console.log('');
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error('\nFatal Error:', errorMessage);
    if (verbose) {
      console.error(error);
    }
    process.exit(1);
  } finally {
    if (sourcePool) await sourcePool.end();
    if (localPool) await localPool.end();
  }
})();

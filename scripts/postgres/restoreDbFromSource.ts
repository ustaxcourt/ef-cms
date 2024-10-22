import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { DescribeDBClustersCommand, RDSClient } from '@aws-sdk/client-rds';
import { Signer } from '@aws-sdk/rds-signer';
import { requireEnvVars } from 'shared/admin-tools/util';
import { spawn } from 'child_process';

// eslint-disable-next-line spellcheck/spell-checker
/*
This script can copy the contents of one database and overwrite the contents of another in a different account.
This script REQUIRES that it be run from the AWS account that is creating the backup, and it will assume a role in the target account.
So if you wanted to restore Test environment from prod, use the environment switcher to point to prod, then fill out all TARGET environment variables with test info.

ENV=test TARGET_ENV=exp3 TARGET_ACCOUNT_ID=xxxxxxxxxx npx ts-node --transpile-only scripts/postgres/restoreDbFromSource.ts
*/

async function main() {
  const sourceEnv = process.env.ENV!;
  const targetEnv = process.env.TARGET_ENV!;
  const targetAccountId = process.env.TARGET_ACCOUNT_ID!;

  requireEnvVars(['ENV', 'TARGET_ENV', 'TARGET_ACCOUNT_ID']);

  const targetRoleArn = `arn:aws:iam::${targetAccountId}:role/cross_account_restore_role_${targetEnv}`;

  const { targetAccessKeyId, targetSecretAccessKey, targetSessionToken } =
    await getTargetAccountCredentials({ targetRoleArn });

  const sourceRdsClient = new RDSClient({ region: 'us-east-1' });
  const targetRdsClient = new RDSClient({
    credentials: {
      accessKeyId: targetAccessKeyId,
      accountId: targetAccountId,
      secretAccessKey: targetSecretAccessKey,
      sessionToken: targetSessionToken,
    },
    region: 'us-east-1',
  });

  const {
    dbName: sourceDbname,
    host: sourceHost,
    port: sourcePort,
    username: sourceUsername,
  } = await describeRDSInstance({
    environment: sourceEnv,
    rdsClient: sourceRdsClient,
  });

  const {
    dbName: targetDbname,
    host: targetHost,
    port: targetPort,
    username: targetUsername,
  } = await describeRDSInstance({
    environment: targetEnv,
    rdsClient: targetRdsClient,
  });

  const backUpFileName = 'dawson.dump';
  await createDbBackup({
    backUpFileName,
    dbName: sourceDbname,
    host: sourceHost,
    port: sourcePort,
    username: sourceUsername,
  });

  await restoreFromBackup({
    backUpFileName,
    dbName: targetDbname,
    host: targetHost,
    port: targetPort,
    targetAccessKeyId,
    targetAccountId,
    targetSecretAccessKey,
    targetSessionToken,
    username: targetUsername,
  });
}
void main();

async function describeRDSInstance({
  environment,
  rdsClient,
}: {
  rdsClient: RDSClient;
  environment: string;
}) {
  const clusterIdentifier = `${environment}-dawson-cluster`;
  const command = new DescribeDBClustersCommand({
    DBClusterIdentifier: clusterIdentifier,
  });
  const describeResponse = await rdsClient.send(command);

  const dbCluster = describeResponse.DBClusters?.[0];

  if (!dbCluster) {
    throw new Error('Source cluster was not defined but expected');
  }

  const host = dbCluster.ReaderEndpoint;
  const port = dbCluster.Port;
  const dbName = dbCluster.DatabaseName;
  const username = `${environment}_developers`;

  if (!host || !port || !dbName) {
    throw new Error('Source configuration was not found');
  }

  return {
    dbName,
    host,
    port,
    username,
  };
}

async function createDbBackup({
  backUpFileName,
  dbName,
  host,
  port,
  username,
}: {
  host: string;
  username: string;
  port: number;
  dbName: string;
  backUpFileName: string;
}): Promise<void> {
  const sourceSigner = new Signer({
    hostname: host,
    port,
    region: 'us-east-1',
    username,
  });

  const sourcePassword = await sourceSigner.getAuthToken();

  await new Promise((resolve, reject) => {
    const result = spawn(
      'pg_dump',
      [
        '--no-privileges',
        '--no-owner',
        `--host=${host}`,
        `--username=${username}`,
        `--port=${port}`,
        `--dbname=${dbName}`,
        `--file=${backUpFileName}`,
        '--format=c',
        '--verbose',
      ],
      { env: { ...process.env, PGPASSWORD: sourcePassword }, stdio: 'pipe' },
    );

    result.stdout.on('data', data => {
      console.log(data.toString('utf-8'));
    });

    result.stderr.on('data', data => {
      console.error(data.toString('utf-8'));
    });

    result.on('close', code => {
      if (!code) {
        console.log(`Successfully created DB backup of ${dbName}`);
        resolve(undefined);
      }
      reject(
        new Error(
          `Failed to create DB backup of ${dbName} with exit code: ${code}`,
        ),
      );
    });
  });
}

async function restoreFromBackup({
  backUpFileName,
  dbName,
  host,
  port,
  targetAccessKeyId,
  targetAccountId,
  targetSecretAccessKey,
  targetSessionToken,
  username,
}: {
  host: string;
  username: string;
  port: number;
  dbName: string;
  backUpFileName: string;
  targetAccessKeyId: string;
  targetAccountId: string;
  targetSecretAccessKey: string;
  targetSessionToken: string;
}): Promise<void> {
  const targetSigner = new Signer({
    credentials: {
      accessKeyId: targetAccessKeyId,
      accountId: targetAccountId,
      secretAccessKey: targetSecretAccessKey,
      sessionToken: targetSessionToken,
    },
    hostname: host,
    port,
    region: 'us-east-1',
    username,
  });
  const targetPassword = await targetSigner.getAuthToken();

  await new Promise(resolve => {
    const result = spawn(
      'pg_restore',
      [
        `--host=${host}`,
        `--username=${username}`,
        `--dbname=${dbName}`,
        `--port=${port}`,
        '--format=c',
        '--verbose',
        '--clean',
        '--no-privileges',
        '--no-owner',
        `${backUpFileName}`,
      ],
      {
        env: {
          ...process.env,
          PGPASSWORD: targetPassword,
        },

        stdio: 'pipe',
      },
    );

    result.stdout.on('data', data => {
      console.log(data.toString('utf-8'));
    });

    result.stderr.on('data', data => {
      console.error(data.toString('utf-8'));
    });

    result.on('close', code => {
      if (code) {
        console.log(
          `DB ${dbName} may have been restored with errors. Check output for errors. Exit code: ${code}`,
        );
      } else {
        console.log(`Successfully restored DB ${dbName}`);
      }
      resolve(undefined);
    });
  });
}

async function getTargetAccountCredentials({
  targetRoleArn,
}: {
  targetRoleArn: string;
}) {
  const stsClient = new STSClient({ region: 'us-east-1' });
  const command = new AssumeRoleCommand({
    RoleArn: targetRoleArn,
    RoleSessionName: 'DB_Restore_Cross_Account_Session',
  });
  const data = await stsClient.send(command);

  const targetAccessKeyId = data.Credentials?.AccessKeyId;
  const targetSecretAccessKey = data.Credentials?.SecretAccessKey;
  const targetSessionToken = data.Credentials?.SessionToken;

  if (!targetAccessKeyId || !targetSecretAccessKey || !targetSessionToken) {
    throw new Error('Could not get credentials of target role');
  }

  return {
    targetAccessKeyId,
    targetSecretAccessKey,
    targetSessionToken,
  };
}

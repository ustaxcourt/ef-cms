import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { DescribeDBClustersCommand, RDSClient } from '@aws-sdk/client-rds';
import { Signer } from '@aws-sdk/rds-signer';
import { execSync } from 'child_process';
import { requireEnvVars } from 'shared/admin-tools/util';

async function main() {
  // const REGION = 'us-east-1';
  // const sourceEnv = process.env.ENV!;
  // const targetEnv = process.env.TARGET_ENV!;
  // const targetAccessKeyId = process.env.TARGET_AWS_ACCESS_KEY_ID!;
  // const targetSecretAccessKey = process.env.TARGET_AWS_SECRET_ACCESS_KEY!;
  // const targetAccountId = process.env.TARGET_AWS_ACCOUNT_ID!;
  // const targetSessionToken = process.env.TARGET_AWS_SESSION_TOKEN!;

  // requireEnvVars([
  //   'ENV',
  //   'TARGET_ENV',
  //   'TARGET_AWS_ACCESS_KEY_ID',
  //   'TARGET_AWS_SECRET_ACCESS_KEY',
  //   'TARGET_AWS_ACCOUNT_ID',
  //   'TARGET_AWS_SESSION_TOKEN',
  // ]);

  const stsClient = new STSClient({ region: 'us-east-1' });
  const command = new AssumeRoleCommand({
    RoleArn: 'arn:aws:iam::515554424717:role/db_test_cody_zach_delete_me',
    RoleSessionName: 'DB_Restore_Cross_Account_Session',
  });
  const data = await stsClient.send(command);
  console.log(
    'Temporary Credentials:',
    JSON.stringify(data.Credentials, null, 2),
  );

  // You can now use data.Credentials to make calls to services in the target account
  // const { AccessKeyId, SecretAccessKey, SessionToken } = data.Credentials;

  // const sourceRdsClient = new RDSClient({ region: REGION });
  // const targetRdsClient = new RDSClient({
  //   credentials: {
  //     accessKeyId: targetAccessKeyId,
  //     accountId: targetAccountId,
  //     secretAccessKey: targetSecretAccessKey,
  //     sessionToken: targetSessionToken,
  //   },
  //   region: REGION,
  // });

  // const {
  //   dbName: sourceDbname,
  //   host: sourceHost,
  //   port: sourcePort,
  //   username: sourceUsername,
  // } = await describeRDSInstance({
  //   environment: sourceEnv,
  //   rdsClient: sourceRdsClient,
  // });

  // const {
  //   dbName: targetDbname,
  //   host: targetHost,
  //   port: targetPort,
  //   username: targetUsername,
  // } = await describeRDSInstance({
  //   environment: targetEnv,
  //   rdsClient: targetRdsClient,
  // });

  // const backUpFileName = 'dawson.dump';
  // await createDbBackup({
  //   backUpFileName,
  //   dbName: sourceDbname,
  //   host: sourceHost,
  //   port: sourcePort,
  //   username: sourceUsername,
  // });

  // await restoreFromBackup({
  //   backUpFileName,
  //   dbName: targetDbname,
  //   host: targetHost,
  //   port: targetPort,
  //   targetAccessKeyId,
  //   targetAccountId,
  //   targetSecretAccessKey,
  //   targetSessionToken,
  //   username: targetUsername,
  // });
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
  console.log(
    'RDS Instance Details:',
    JSON.stringify(describeResponse, null, 2),
  );

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
  const dumpCommand = [
    `PGPASSWORD="${sourcePassword}"`,
    'pg_dump',
    '--no-privileges',
    '--no-owner',
    `--host=${host}`,
    `--username=${username}`,
    `--port=${port}`,
    `--dbname=${dbName}`,
    `--file=${backUpFileName}`,
    '--format=c',
    '--verbose',
  ].join(' ');

  const pgDumpOutput = execSync(dumpCommand, { encoding: 'utf-8' });
  console.log(pgDumpOutput);
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

  const restoreCommand = [
    `PGPASSWORD="${targetPassword}"`,
    'pg_restore',
    `--host ${host}`,
    `--username ${username}`,
    `--dbname ${dbName}`,
    `--port=${port}`,
    '--format=c',
    '--verbose',
    '--clean',
    '--no-privileges',
    '--no-owner',
    `${backUpFileName}`,
  ].join(' ');
  const restoreOutput = execSync(restoreCommand, { encoding: 'utf-8' });
  console.log(restoreOutput);
}

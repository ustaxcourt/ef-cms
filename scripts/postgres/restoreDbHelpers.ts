import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { DescribeDBClustersCommand, RDSClient } from '@aws-sdk/client-rds';
import { Signer } from '@aws-sdk/rds-signer';
import { runCommand } from '../helpers/runCommand';

export const describeRDSInstance = async ({
  environment,
  rdsClient,
  useWriter = false,
}: {
  environment: string;
  rdsClient: RDSClient;
  useWriter: boolean;
}): Promise<{
  dbName: string;
  host: string;
  port: number;
  username: string;
}> => {
  const clusterIdentifier = `${environment}-dawson-cluster`;
  const command = new DescribeDBClustersCommand({
    DBClusterIdentifier: clusterIdentifier,
  });
  const describeResponse = await rdsClient.send(command);

  const dbCluster = describeResponse.DBClusters?.[0];

  if (!dbCluster) {
    throw new Error('Source cluster was not defined but expected');
  }

  const host = useWriter ? dbCluster.Endpoint : dbCluster.ReaderEndpoint;
  const port = dbCluster.Port;
  const dbName = dbCluster.DatabaseName;
  const username = `${environment}_dawson`;

  if (!host || !port || !dbName) {
    throw new Error('Source configuration was not found');
  }

  return {
    dbName,
    host,
    port,
    username,
  };
};

export const createDbBackup = async ({
  backUpFileName,
  dbName,
  host,
  port,
  username,
}: {
  backUpFileName: string;
  dbName: string;
  host: string;
  port: number;
  username: string;
}): Promise<void> => {
  const sourceSigner = new Signer({
    hostname: host,
    port,
    region: 'us-east-1',
    username,
  });

  const sourcePassword = await sourceSigner.getAuthToken();

  await runCommand(
    'pg_dump',
    [
      '--no-privileges',
      '--no-owner',
      `--host=${host}`,
      `--username=${username}`,
      `--port=${port}`,
      `--dbname=${dbName}`,
      `--file=${backUpFileName}`,
      '--verbose',
    ],
    { ...process.env, PGPASSWORD: sourcePassword },
  );
};

export const createSingleTableBackup = async ({
  backUpFileName,
  dbName,
  host,
  port,
  sourceTableName,
  username,
}: {
  backUpFileName: string;
  dbName: string;
  host: string;
  port: number;
  sourceTableName: string;
  username: string;
}): Promise<void> => {
  const sourceSigner = new Signer({
    hostname: host,
    port,
    region: 'us-east-1',
    username,
  });

  const sourcePassword = await sourceSigner.getAuthToken();

  await runCommand(
    'pg_dump',
    [
      '--no-privileges',
      '--no-owner',
      `--host=${host}`,
      `--username=${username}`,
      `--port=${port}`,
      `--dbname=${dbName}`,
      `--table=${sourceTableName}`,
      `--file=${backUpFileName}`,
      '--verbose',
    ],
    { ...process.env, PGPASSWORD: sourcePassword },
  );
};

export const restoreFromBackup = async ({
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
}): Promise<void> => {
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

  await dropAllTargetTables({
    dbName,
    host,
    port,
    targetPassword,
    username,
  });

  await runCommand(
    'psql',
    [
      `--host=${host}`,
      `--username=${username}`,
      `--dbname=${dbName}`,
      `--port=${port}`,
      `--file=${backUpFileName}`,
      '--echo-errors',
    ],
    {
      ...process.env,
      PGPASSWORD: targetPassword,
    },
  );
};

export const restoreSingleTableFromBackup = async ({
  backUpFileName,
  dbName,
  host,
  port,
  targetAccessKeyId,
  targetAccountId,
  targetSecretAccessKey,
  targetSessionToken,
  targetTableName,
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
  targetTableName: string;
}): Promise<void> => {
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

  await dropTargetTable({
    dbName,
    host,
    port,
    targetPassword,
    targetTableName,
    username,
  });

  await runCommand(
    'psql',
    [
      `--host=${host}`,
      `--username=${username}`,
      `--dbname=${dbName}`,
      `--port=${port}`,
      `--file=${backUpFileName}`,
      '--echo-errors',
    ],
    {
      ...process.env,
      PGPASSWORD: targetPassword,
    },
  );
};

export const getTargetAccountCredentials = async ({
  targetRoleArn,
}: {
  targetRoleArn: string;
}): Promise<{
  targetAccessKeyId: string;
  targetSecretAccessKey: string;
  targetSessionToken: string;
}> => {
  const stsClient = new STSClient({ region: 'us-east-1' });
  const command = new AssumeRoleCommand({
    RoleArn: targetRoleArn,
    RoleSessionName: 'DB_Restore_Session',
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
};

export const dropAllTargetTables = async ({
  dbName,
  host,
  port,
  targetPassword,
  username,
}: {
  host: string;
  username: string;
  port: number;
  dbName: string;
  targetPassword: string;
}): Promise<void> => {
  // For each table in the target db public schema, we will create a SQL DROP command and then execute it.
  await runCommand(
    'psql',
    [
      `--host=${host}`,
      `--username=${username}`,
      `--dbname=${dbName}`,
      `--port=${port}`,
      '--no-password',
      `--command=DO $$ DECLARE
          stmt text;
        BEGIN
          FOR stmt IN
            SELECT 'DROP TABLE IF EXISTS "' || tablename || '" CASCADE;'
            FROM pg_tables
            WHERE schemaname = 'public'
          LOOP
            EXECUTE stmt;
          END LOOP;
        END
        $$;`,
    ],
    {
      ...process.env,
      PGPASSWORD: targetPassword,
    },
  );
};

export const dropTargetTable = async ({
  dbName,
  host,
  port,
  targetPassword,
  targetTableName,
  username,
}: {
  dbName: string;
  host: string;
  port: number;
  targetPassword: string;
  targetTableName: string;
  username: string;
}): Promise<void> => {
  await runCommand(
    'psql',
    [
      `--host=${host}`,
      `--username=${username}`,
      `--dbname=${dbName}`,
      `--port=${port}`,
      '--no-password',
      `--command=DROP TABLE IF EXISTS ${targetTableName} CASCADE;`,
    ],
    {
      ...process.env,
      PGPASSWORD: targetPassword,
    },
  );
};

export const removeFiles = async (backupFiles: string[]): Promise<void> => {
  await runCommand('rm', ['-f', ...backupFiles]);
  console.log(`Removed ${backupFiles.join(' ')}`);
};

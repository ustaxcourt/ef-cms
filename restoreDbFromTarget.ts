import { Signer } from '@aws-sdk/rds-signer';
import { execSync } from 'child_process';

async function main() {
  const sourceDbname = process.env.SOURCE_DB_NAME;
  const sourceHost = process.env.SOURCE_HOST;
  const sourcePort = process.env.SOURCE_PORT;
  const sourceUsername = process.env.SOURCE_USERNAME;
  const targetDbname = process.env.TARGET_DB_NAME;
  const targetHost = process.env.TARGET_HOST;
  const targetUsername = process.env.TARGET_USERNAME;
  const targetPort = process.env.TARGET_PORT;
  const targetAccessKeyId = process.env.TARGET_AWS_ACCESS_KEY_ID;
  const targetSecretAccessKey = process.env.TARGET_AWS_SECRET_ACCESS_KEY;
  const targetAccountId = process.env.TARGET_AWS_ACCOUNT_ID;
  const targetSessionToken = process.env.TARGET_AWS_SESSION_TOKEN;

  if (
    !sourceDbname ||
    !sourceHost ||
    !sourcePort ||
    !sourceUsername ||
    !targetDbname ||
    !targetHost ||
    !targetUsername ||
    !targetPort ||
    !targetAccessKeyId ||
    !targetSecretAccessKey ||
    !targetAccountId
  ) {
    throw new Error('Missing environment variables');
  }

  const sourceSigner = new Signer({
    hostname: sourceHost,
    port: 5432,
    region: 'us-east-1',
    username: sourceUsername,
  });

  const sourcePassword = await sourceSigner.getAuthToken();
  const dumpCommand = [
    `PGPASSWORD="${sourcePassword}"`,
    'pg_dump',
    '--no-privileges',
    '--no-owner',
    `--host=${sourceHost}`,
    `--username=${sourceUsername}`,
    `--port=${sourcePort}`,
    `--dbname=${sourceDbname}`,
    '--file=ts_dump.dump',
    '--format=c',
    '--verbose',
  ].join(' ');

  const pgDumpOutput = execSync(dumpCommand, { encoding: 'utf-8' });
  console.log(pgDumpOutput);

  const targetSigner = new Signer({
    credentials: {
      accessKeyId: targetAccessKeyId,
      accountId: targetAccountId,
      secretAccessKey: targetSecretAccessKey,
      sessionToken: targetSessionToken,
    },
    hostname: targetHost,
    port: parseInt(targetPort),
    region: 'us-east-1',
    username: targetUsername,
  });
  const targetPassword = await targetSigner.getAuthToken();

  const restoreCommand = [
    `PGPASSWORD="${targetPassword}"`,
    'pg_restore',
    `--host ${targetHost}`,
    `--username ${targetUsername}`,
    `--dbname ${targetDbname}`,
    `--port=${targetPort}`,
    '--format=c',
    '--verbose',
    '--clean',
    '--no-privileges',
    '--no-owner',
    'ts_dump.dump',
  ].join(' ');
  const restoreOutput = execSync(restoreCommand, { encoding: 'utf-8' });
  console.log(restoreOutput);
}
void main();

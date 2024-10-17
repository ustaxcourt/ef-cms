import { SSMClient } from '@aws-sdk/client-ssm';
import { execSync } from 'child_process';

async function main() {
  // const ssmClient = new SSMClient({ credentials: {}, region: 'us-east-1' });
  const sourceDbname = process.env.SOURCE_DB_NAME;
  const sourceHost = process.env.SOURCE_HOST;
  const sourcePassword = process.env.SOURCE_PASSWORD;
  const sourcePort = process.env.SOURCE_PORT;
  const sourceUsername = process.env.SOURCE_USERNAME;
  // const targetDbname = process.env.TARGET_DB_NAME;
  // const targetHost = process.env.TARGET_HOST;
  // const targetPassword = process.env.TARGET_PASSWORD;
  // const targetPort = process.env.TARGET_PORT;
  // const targetUsername = process.env.TARGET_USERNAME;

  if (
    !sourceDbname ||
    !sourceHost ||
    !sourcePassword ||
    !sourcePort ||
    !sourceUsername
    // !targetDbname ||
    // !targetHost ||
    // !targetPassword ||
    // !targetPort ||
    // !targetUsername
  ) {
    throw new Error('Missing environment variables');
  }

  const pgDumpOutput = execSync(
    `PGPASSWORD="${sourcePassword}" pg_dump --host=${sourceHost} --username=${sourceUsername} --port=${sourcePort} --dbname=${sourceDbname} --file=db_dump.dump --format=c --verbose`,
    { encoding: 'utf-8' },
  );
  console.log(pgDumpOutput);
}
void main();

type DatabaseInfo = {
  password: string;
  host: string;
  username: string;
  port: string;
  dbname: string;
};

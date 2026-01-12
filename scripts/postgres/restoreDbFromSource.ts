#!/usr/bin/env -S npx ts-node --transpile-only

// This script can copy the contents of one database and overwrite the contents
// of another in a different account. It must be run from the AWS account that
// is creating the backup, and it will assume a role in the target account.

import { RDSClient } from '@aws-sdk/client-rds';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { sanitizeDumpFile } from 'scripts/emailReplacer';
import {
  createDbBackup,
  describeRDSInstance,
  getTargetAccountCredentials,
  removeFiles,
  restoreFromBackup,
} from './restoreDbHelpers';

const scriptConfig: ScriptConfig = {
  description:
    'restoreDbFromSource - Replaces the target database with a dump of the source database',
  environment: {
    sourceEnv: 'ENV',
    targetAccountId: 'TARGET_ACCOUNT_ID',
    targetEnv: 'TARGET_ENV',
  },
  requireActiveAwsSession: true,
};
const { sourceEnv, targetAccountId, targetEnv } = parseArgsAndEnvVars(
  scriptConfig,
) as { [key: string]: string };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    const targetRoleArn = `arn:aws:iam::${targetAccountId}:role/restore_role_${targetEnv}`;

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
      useWriter: false,
    });

    const {
      dbName: targetDbname,
      host: targetHost,
      port: targetPort,
      username: targetUsername,
    } = await describeRDSInstance({
      environment: targetEnv,
      rdsClient: targetRdsClient,
      useWriter: true,
    });

    const backUpFileName = 'dawson-dump.sql';
    await createDbBackup({
      backUpFileName,
      dbName: sourceDbname,
      host: sourceHost,
      port: sourcePort,
      username: sourceUsername,
    });

    const sanitizedFileName = `sanitized-${backUpFileName}`;
    await sanitizeDumpFile(backUpFileName, sanitizedFileName);

    await restoreFromBackup({
      backUpFileName: sanitizedFileName,
      dbName: targetDbname,
      host: targetHost,
      port: targetPort,
      targetAccessKeyId,
      targetAccountId,
      targetSecretAccessKey,
      targetSessionToken,
      username: targetUsername,
    });

    await removeFiles([backUpFileName, sanitizedFileName]);
  } catch (error) {
    console.error('Fatal error running DB restoration:', error);
    process.exit(1);
  }
})();

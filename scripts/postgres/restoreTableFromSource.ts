#!/usr/bin/env -S npx ts-node --transpile-only

// This script will copy the contents of one table in the source database and
// either:
//   - overwrite the contents of that same table, or
//   - create a table with a different name with these contents
// in the target account. It must be run from the AWS account that is creating
// the backup, and it will assume a role in the target account.

import { RDSClient } from '@aws-sdk/client-rds';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  createSingleTableBackup,
  describeRDSInstance,
  getTargetAccountCredentials,
  removeFiles,
  restoreSingleTableFromBackup,
} from './restoreDbHelpers';
import { sanitizeDumpFile } from '../emailReplacer';
import { runCommand } from '../helpers/runCommand';

const scriptConfig: ScriptConfig = {
  description:
    'restoreTableFromSource - Replaces the target table with a dump of the source table',
  environment: {
    sourceEnv: 'ENV',
    targetAccountId: 'TARGET_ACCOUNT_ID',
    targetEnv: 'TARGET_ENV',
  },
  parameters: {
    newTargetTableName: {
      position: 1,
      required: false,
      type: 'string',
    },
    sourceTableName: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const {
  newTargetTableName,
  sourceEnv,
  sourceTableName,
  targetAccountId,
  targetEnv,
} = parseArgsAndEnvVars(scriptConfig) as { [key: string]: string };
const targetTableName = newTargetTableName || sourceTableName;

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

    const backUpFileName = `${sourceTableName}-dump.sql`;
    await createSingleTableBackup({
      backUpFileName,
      dbName: sourceDbname,
      host: sourceHost,
      port: sourcePort,
      sourceTableName,
      username: sourceUsername,
    });

    if (sourceTableName !== targetTableName) {
      const sourceIndexPrefix = sourceTableName.replace('dw', 'idx');
      const targetIndexPrefix = targetTableName.replace('dw', 'idx');
      const sedExpression = `s/${sourceTableName}/${targetTableName}/g;s/${sourceIndexPrefix}/${targetIndexPrefix}/g`;
      console.log('Replacing instances in the dump file', {
        [sourceTableName]: targetTableName,
        [sourceIndexPrefix]: targetIndexPrefix,
      });
      await runCommand('sed', ['-i', '', sedExpression, backUpFileName]);
    }

    const sanitizedFileName = `sanitized-${backUpFileName}`;
    await sanitizeDumpFile(backUpFileName, sanitizedFileName);

    await restoreSingleTableFromBackup({
      backUpFileName: sanitizedFileName,
      dbName: targetDbname,
      host: targetHost,
      port: targetPort,
      targetAccessKeyId,
      targetAccountId,
      targetSecretAccessKey,
      targetSessionToken,
      targetTableName,
      username: targetUsername,
    });

    await removeFiles([backUpFileName, sanitizedFileName]);
  } catch (error) {
    console.error('Fatal error running DB restoration:', error);
    process.exit(1);
  }
})();

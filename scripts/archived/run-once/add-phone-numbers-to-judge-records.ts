#!/usr/bin/env -S npx ts-node --transpile-only

/*
We used to hard-code information for judges' chambers.
The only piece of data not in our DB was the phone
number. This script therefore adds the phone number
to the relevant DB records.
*/

import * as client from '@web-api/persistence/dynamodbClientService';
import { RawUser } from '@shared/business/entities/User';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import { type TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { createApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';
import { getDestinationTableInfo } from '../../../shared/admin-tools/util';
import { getTestJudgesChambers } from '@shared/test/mockJudgesChambers';

const scriptConfig: ScriptConfig = {
  description:
    'add-phone-numbers-to-judge-records - Sets the judgePhoneNumber property for Judge user entities.',
  environment: { env: 'ENV' },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const OLD_HARDCODED_CHAMBERS_DATA = getTestJudgesChambers();

const getPhoneNumberForJudgeUser = (judgeUser: RawUser): string | undefined => {
  return Object.values(OLD_HARDCODED_CHAMBERS_DATA).find(
    data => data.judgeFullName === judgeUser.judgeFullName,
  )?.phoneNumber;
};

(async () => {
  const applicationContext = createApplicationContext();

  const { tableName } = await getDestinationTableInfo();
  environment.dynamoDbTableName = tableName;

  // Get all the existing judge user records
  const judgeUsers: RawUser[] = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({ applicationContext, section: 'judge' });

  let totalUpdated = 0;
  // For each judge user record, we get the relevant phone number.
  // Then we update the record so that the phone number is stored on the record.
  for (const judgeUser of judgeUsers) {
    const phoneNumber = getPhoneNumberForJudgeUser(judgeUser);
    if (!phoneNumber) {
      console.error(
        `Could not get phone number for ${judgeUser.judgeFullName}.`,
      );
      continue;
    }
    judgeUser.judgePhoneNumber = phoneNumber;
    await client.put({
      Item: judgeUser as unknown as TDynamoRecord,
      applicationContext,
    });
    totalUpdated += 1;
    console.log(`Updated ${judgeUser.judgeFullName}`);
  }

  console.log(`\nUpdated ${totalUpdated} out of ${judgeUsers.length} judges`);
})();

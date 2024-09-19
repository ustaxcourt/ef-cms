#!/usr/bin/env npx ts-node --transpile-only
/*
We used to hard-code information for judges' chambers.
The only piece of data not in our DB was the phone
number. This script therefore adds the phone number
to the relevant DB records.
*/

import { createApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';
import * as client from '../../web-api/src/persistence/dynamodbClientService';
import {
  requireEnvVars,
  getDestinationTableInfo,
} from '../../shared/admin-tools/util';
import { RawUser } from '../../shared/src/business/entities/User';
import { getTestJudgesChambers } from '../../shared/src/test/mockJudgesChambers';

requireEnvVars(['ENV']);

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

  // Get all of the existing judge user records
  const judgeUsers: RawUser[] = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({
      applicationContext,
      section: 'judge',
    });

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
    await client.put({ applicationContext, Item: judgeUser });
    totalUpdated += 1;
    console.log(`Updated ${judgeUser.judgeFullName}`);
  }

  console.log(`\nUpdated ${totalUpdated} out of ${judgeUsers.length} judges`);
})();

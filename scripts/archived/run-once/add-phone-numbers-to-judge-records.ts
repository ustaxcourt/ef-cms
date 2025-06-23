#!/usr/bin/env -S npx ts-node --transpile-only

/*
We used to hard-code information for judges' chambers.
The only piece of data not in our DB was the phone
number. This script therefore adds the phone number
to the relevant DB records.
*/

import { RawUser } from '@shared/business/entities/User';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import { getTestJudgesChambers } from '@shared/test/mockJudgesChambers';
import { getUsersInSections } from '@web-api/persistence/postgres/users/getUsersInSections';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { updateUser } from '@web-api/persistence/postgres/users/updateUser';

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
  // Get all the existing judge user records
  const judgeUsers: RawUser[] = await getUsersInSections({
    sections: [ROLES.judge],
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
    await updateUser({ userToUpdate: judgeUser });
    totalUpdated += 1;
    console.log(`Updated ${judgeUser.judgeFullName}`);
  }

  console.log(`\nUpdated ${totalUpdated} out of ${judgeUsers.length} judges`);
})();

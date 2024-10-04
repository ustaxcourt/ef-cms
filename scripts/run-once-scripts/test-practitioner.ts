#!/usr/bin/env npx ts-node --transpile-only
/*
We used to hard-code information for judges' chambers.
The only piece of data not in our DB was the phone
number. This script therefore adds the phone number
to the relevant DB records.
*/

import { createApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';
import {
  requireEnvVars,
  getDestinationTableInfo,
} from '../../shared/admin-tools/util';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';

requireEnvVars(['ENV']);

(async () => {
  const applicationContext = createApplicationContext();

  const { tableName } = await getDestinationTableInfo();
  environment.dynamoDbTableName = tableName;

  try {
    const result = await applicationContext
      .getUseCases()
      .getPractitionerCasesInteractor(
        applicationContext,
        {
          userId: '0a0fb8d6-398f-4e17-9da7-90e2b921730e',
        },
        mockJudgeUser,
      );
    console.log('NO ERROR');
  } catch (e) {
    console.log('ERROR');
  }
})();

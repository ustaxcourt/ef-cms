#!/usr/bin/env -S npx ts-node --transpile-only

import { JUDGE_TITLES } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { User } from '@shared/business/entities/User';
import { createApplicationContext } from '@web-api/applicationContext';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

const scriptConfig: ScriptConfig = {
  description: "update-judge-titles - Sets Judges' judgeTitle attribute",
  environment: {
    dynamoDbTableName: 'DYNAMODB_TABLE_NAME',
    env: 'ENV',
    region: 'REGION',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

// ******************************** INPUTS ******************************
const judgesToUpdateIds: { userId: string; judgeTitle: string }[] = [
  {
    judgeTitle: 'EXAMPLE',
    userId: '111111-11111-1111-111111-111111',
  },
];
// **********************************************************************

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  for (const judge of judgesToUpdateIds) {
    const { userId } = judge;

    const userToUpdate = await getUserById({ userId });
    const userEntity = new User(userToUpdate);
    userEntity.judgeTitle = JUDGE_TITLES.find(jt => jt === judge.judgeTitle);

    await applicationContext.getPersistenceGateway().updateUser({
      applicationContext,
      user: userEntity.validate().toRawObject(),
    });
  }
})();

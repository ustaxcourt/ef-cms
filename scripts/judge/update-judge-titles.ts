#!/usr/bin/env npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgumentsAndEnvironmentVariables,
} from '../helpers/parseArgumentsAndEnvironmentVariables';
import { User } from '@shared/business/entities/User';
import { createApplicationContext } from '@web-api/applicationContext';

const scriptConfig: ScriptConfig = {
  description: "update-judge-titles - Sets Judges' judgeTitle attribute",
  environment: {
    dynamoDbTableName: 'DYNAMODB_TABLE_NAME',
    env: 'ENV',
    region: 'REGION',
  },
};
parseArgumentsAndEnvironmentVariables(scriptConfig);

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

  for (let judge of judgesToUpdateIds) {
    const { userId } = judge;

    const userToUpdate = await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId });
    const userEntity = new User(userToUpdate);
    userEntity.judgeTitle = judge.judgeTitle;

    await applicationContext.getPersistenceGateway().updateUser({
      applicationContext,
      user: userEntity.validate().toRawObject(),
    });
  }
})();

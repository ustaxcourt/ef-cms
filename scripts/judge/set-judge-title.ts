#!/usr/bin/env -S npx ts-node --transpile-only

import {
  JUDGE_TITLES,
  JudgeTitle,
} from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { User } from '@shared/business/entities/User';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';

const scriptConfig: ScriptConfig = {
  description:
    'set-judge-title - Updates the judgeTitle for a user and prints their name',
  environment: {
    env: 'ENV',
    region: 'REGION',
  },
  parameters: {
    userId: {
      position: 0,
      required: true,
      type: 'string',
    },
    judgeTitle: {
      position: 1,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};

const { userId, judgeTitle } = parseArgsAndEnvVars(scriptConfig) as {
  userId: string;
  judgeTitle: JudgeTitle;
};

if (!JUDGE_TITLES.includes(judgeTitle)) {
  console.error(`Judge title must be valid`);
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const userToUpdate = await getUserById({ userId });
  if (!userToUpdate) {
    console.error(`User not found with user id ${userId}`);
    process.exit(1);
  }

  const userEntity = new User(userToUpdate);
  userEntity.judgeTitle = judgeTitle;

  await upsertUsers([userEntity.validate().toRawObject()]);

  // Print the user's info (used by callers for messages/Cognito display)
  console.log(JSON.stringify(userEntity));
})();

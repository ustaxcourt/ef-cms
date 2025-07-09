#!/usr/bin/env -S npx ts-node --transpile-only

import { RawUser } from '@shared/business/entities/User';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { createApplicationContext } from '@web-api/applicationContext';
import { createOrUpdateUser } from 'shared/admin-tools/user/admin';
import { getNewPasswordForEnvironment } from './make-new-password';
import { judgeUser } from '@shared/test/mockUsers';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import joi from 'joi';
import { getUsersInSectionInteractor } from '@web-api/business/useCases/user/getUsersInSectionInteractor';

const scriptConfig: ScriptConfig = {
  description:
    'add-user - Creates a new DAWSON user in a deployed environment.',
  environment: {
    dynamoDbTableName: 'DYNAMODB_TABLE_NAME',
    env: 'ENV',
    userPoolId: 'USER_POOL_ID',
  },
  parameters: {
    email: {
      position: 0,
      required: true,
      transform: 'toLowerCase',
      type: 'string',
    },
    name: {
      position: 1,
      required: true,
      type: 'string',
    },
    role: {
      position: 2,
      required: true,
      type: 'string',
    },
    section: {
      position: 3,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};

interface UserParamsInterface {
  email: string;
  name: string;
  role: string;
  section: string;
}

const usage = error => {
  if (error) {
    console.log(`\nERROR: ${error}\n`);
  }

  console.log(`
  Use this script to create a new DAWSON user.

    $ npm run admin:create-user <EMAIL> <NAME> <ROLE> <SECTION>

    - EMAIL: Email address of the user
    - NAME: The full name of the user
    - ROLE: The user's role at the Court
    - SECTION: The section they belong to

  Example:

    $ npm run admin:create-user user@example.com "Test User" admissionsclerk admissions\n`);
  process.exit();
};

// We create the context as a judge user to have permissions to access the chambers interactor
const applicationContext = createApplicationContext(judgeUser);

const checkParams = ({
  params,
  validChambersSections,
}: {
  params: UserParamsInterface;
  validChambersSections: string[];
}) => {
  const schema = joi.object().keys({
    email: joi.string().email().required(),
    name: joi.string().required(),
    role: joi
      .string()
      .valid(
        ...[
          'adc',
          'admissionsclerk',
          'clerkofcourt',
          'docketclerk',
          'petitionsclerk',
          'trialclerk',
          'floater',
          'general',
          'reportersOffice',
          'chambers',
        ],
      ),
    section: joi
      .string()
      .valid(
        ...[
          'adc',
          'admissions',
          'clerkofcourt',
          'docket',
          'petitions',
          'trialClerks',
          'floater',
          'general',
          'reportersOffice',
          ...validChambersSections,
        ],
      ),
  });

  const { error, value } = schema.validate(params);
  if (error) {
    usage(error);
  }
  console.log(value);
  return value;
};

export const sendWelcomeEmail = async ({
  email,
  userPoolId,
}: {
  email: string;
  userPoolId: string;
}): Promise<void> => {
  try {
    await applicationContext.getCognito().adminCreateUser({
      MessageAction: 'RESEND',
      UserPoolId: userPoolId,
      Username: email,
    });
  } catch (err) {
    console.error('Error sending welcome email', err);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const { email, name, role, section, userPoolId } = parseArgsAndEnvVars(
    scriptConfig,
  ) as { [k: string]: string };

  const judgeUsers: RawUser[] = await getUsersInSectionInteractor(
    { section: 'judge' },
    mockJudgeUser,
  );
  const validChambersSections = judgeUsers.map(user => user.section!);
  const params: UserParamsInterface = {
    email,
    name,
    role,
    section,
  };
  checkParams({ params, validChambersSections });
  await createOrUpdateUser(applicationContext, {
    password: getNewPasswordForEnvironment(),
    setPasswordAsPermanent: true,
    user: { ...params } as RawUser,
  });
  await sendWelcomeEmail({ email, userPoolId });
})();

#!/usr/bin/env -S npx ts-node --transpile-only

import { JudgeTitle } from '@shared/business/entities/EntityConstants';
import { RawUser, User } from '@shared/business/entities/User';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { createApplicationContext } from '@web-api/applicationContext';
import { createOrUpdateUser } from 'shared/admin-tools/user/admin';
import {
  emailIsInExpectedFormat,
  expectedEmailFormats,
  expectedJudgeTitles,
  getChambersNameFromJudgeName,
  judgeTitleIsInExpectedFormat,
  phoneIsInExpectedFormat,
  promptUser,
} from 'scripts/user/add-or-update-judge-helpers';
import { getNewPasswordForEnvironment } from './make-new-password';

/**
 * This script will add a judge user to a deployed environment.
 * It creates both the Cognito record and the associated Dynamo record.
 * Required parameters: name, judgeFullName, and email
 * Optional parameters: phone (defaults to none), judgeTitle (defaults to "Judge"), isSeniorJudge (defaults to false)
 * Note that a phone number is eventually required; otherwise, trial information will
 * lack a chambers number. To add one later, use update-judge.ts.
 *
 *  Example usage:
 *
 * $ ./scripts/user/add-judge.ts Way "Kashi Way" judge.way@ustaxcourt.gov ["(123) 123-1234" "Special Trial Judge" --isSeniorJudge]
 *
 * Note that this script SHOULD be temporary: it is meant as a slight improvement from the current ill-defined process.
 * Please extract into application logic!
 */

const scriptConfig: ScriptConfig = {
  description:
    'add-judge - Creates a new Judge user in a deployed environment.',
  environment: {
    dynamoDbTableName: 'DYNAMODB_TABLE_NAME',
    env: 'ENV',
    userPoolId: 'USER_POOL_ID',
  },
  parameters: {
    email: {
      position: 2,
      required: true,
      type: 'string',
    },
    isSeniorJudge: {
      default: false,
      short: 's',
      type: 'boolean',
    },
    judgeFullName: {
      position: 1,
      required: true,
      type: 'string',
    },
    judgeTitle: {
      default: 'Judge',
      position: 4,
      type: 'string',
    },
    name: {
      position: 0,
      required: true,
      type: 'string',
    },
    phone: {
      position: 3,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  const { email, isSeniorJudge, judgeFullName, judgeTitle, name, phone } =
    parseArgsAndEnvVars(scriptConfig) as {
      email: string;
      isSeniorJudge: boolean;
      judgeFullName: string;
      judgeTitle: string;
      name: string;
      phone: string;
    };

  // Check for mistaken emails
  if (!emailIsInExpectedFormat({ email, judgeName: name })) {
    const userInput = await promptUser(
      `Warning: The email you entered does not match expected formats: ${expectedEmailFormats(name).join(', ')}. Continue anyway? y/n `,
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }

  // Check for mistaken phone numbers
  if (phone && !phoneIsInExpectedFormat(phone)) {
    const userInput = await promptUser(
      'Warning: The phone number you entered does not match the expected format: (XXX) XXX-XXXX. Continue anyway? y/n ',
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }

  // Check for mistaken judgeTitle
  if (!judgeTitleIsInExpectedFormat(judgeTitle)) {
    const userInput = await promptUser(
      `Warning: The judgeTitle you entered does not match expected values: ${expectedJudgeTitles.join(', ')}. Continue anyway? y/n `,
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }

  console.log('Setting up information to store ... ');
  const section = getChambersNameFromJudgeName(name);
  const role = 'judge';

  const dynamoUserInfo: RawUser = {
    email,
    entityName: 'User',
    isSeniorJudge,
    judgeFullName,
    judgePhoneNumber: phone,
    judgeTitle: judgeTitle as JudgeTitle,
    name,
    role,
    section,
    userId: applicationContext.getUniqueId(), // Silly as this will be overwritten, but we need one for validation
  };
  const rawUser = new User(dynamoUserInfo).validate().toRawObject();

  console.log('Adding user information to Dynamo and Cognito ... ');
  const { userId } = await createOrUpdateUser(applicationContext, {
    password: getNewPasswordForEnvironment(),
    setPasswordAsPermanent: false,
    user: rawUser,
  });

  console.log(
    `\nSuccess! Created Judge ${judgeFullName} with userId = ${userId} and email = ${email}.`,
  );
  console.log(
    'If you need to update this judge, run update-judge.ts using this email.\n',
  );
})();

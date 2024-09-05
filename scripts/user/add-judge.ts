#!/usr/bin/env npx ts-node --transpile-only
import { JudgeTitle } from '../../shared/src/business/entities/EntityConstants';
import { RawUser, User } from '@shared/business/entities/User';
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
import { environment } from '@web-api/environment';
import {
  getDestinationTableInfo,
  getUserPoolId,
  requireEnvVars,
} from '../../shared/admin-tools/util';
import { getNewPasswordForEnvironment } from './make-new-password';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * This script will add a judge user to a deployed environment.
 * It creates both the Cognito record and the associated Dynamo record.
 * Required parameters: name, judgeFullName, and email
 * Optional parameters: phone (defaults to none), isSeniorJudge (defaults to false), judgeTitle (defaults to "Judge")
 * Note that a phone number is eventually required; otherwise, trial information will
 * lack a chambers number. To add one later, use update-judge.ts.
 *
 *  Example usage:
 *
 * $ npx ts-node --transpile-only add-judge.ts Way "Kashi Way" judge.way@ustaxcourt.gov ["(123) 123-1234" false "Special Trial Judge"]
 *
 * Note that this script SHOULD be temporary: it is meant as a slight improvement from the current ill-defined process.
 * Please extract into application logic!
 */

requireEnvVars(['ENV']);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext();

  // Required
  const name = process.argv[2];
  const judgeFullName = process.argv[3];
  const email = process.argv[4];

  // Optional, though a phone number needs to be provided eventually
  // otherwise the chambers will have no associated phone number on trial info
  const phone = process.argv[5];
  const isSeniorJudge = process.argv[6]
    ? process.argv[6].toLowerCase() === 'true'
    : false;
  const judgeTitle = process.argv[7] ? process.argv[7] : 'Judge';

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

  environment.userPoolId = await getUserPoolId();
  const { tableName } = await getDestinationTableInfo();
  environment.dynamoDbTableName = tableName;

  let dynamoUserInfo: RawUser = {
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

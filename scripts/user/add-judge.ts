import { RawUser, User } from '@shared/business/entities/User';
import { Role } from '../../shared/src/business/entities/EntityConstants';
import { createApplicationContext } from '@web-api/applicationContext';
import {
  emailIsInExpectedFormat,
  expectedEmailFormats,
  getChambersNameFromJudgeName,
  phoneIsInExpectedFormat,
  promptUser,
} from 'scripts/user/add-or-update-judge-helpers';
import { environment } from '@web-api/environment';
import {
  getDestinationTableInfo,
  getUserPoolId,
  requireEnvVars,
} from '../../shared/admin-tools/util';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * This script will add a judge user to a deployed environment.
 * It creates both the Cognito record and the associated Dynamo record.
 * Required parameters: name, judgeFullName, and email
 * Optional parameters: phone (defaults to none), isSeniorJudge (defaults to false)
 * Note that a phone number is eventually required; otherwise, trial information will
 * lack a chambers number. To add one later, use update-judge.ts.
 *
 *  Example usage:
 *
 * $ npx ts-node --transpile-only add-judge.ts Way "Kashi Way" judge.way@ustaxcourt.gov ["(123) 123-1234" false]
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

  // Check for mistaken emails
  if (!emailIsInExpectedFormat({ email, judgeName: name })) {
    const userInput = await promptUser(
      `\nWarning: The email you entered does not match expected formats: ${expectedEmailFormats(name).join(', ')}. Continue anyway? y/n `,
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }

  // Check for mistaken phone numbers
  if (phone && !phoneIsInExpectedFormat(phone)) {
    const userInput = await promptUser(
      '\nWarning: The phone number you entered does not match the expected format: (XXX) XXX-XXXX. Continue anyway? y/n ',
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }

  console.log('\nSetting up information to store ... \n');

  const section = getChambersNameFromJudgeName(name);
  const judgeTitle = 'Judge';
  const role = 'judge';
  const userId = applicationContext.getUniqueId();

  const userPoolId = await getUserPoolId();

  environment.userPoolId = userPoolId;
  const { tableName } = await getDestinationTableInfo();
  environment.dynamoDbTableName = tableName;

  const cognitoUserInfo: {
    email: string;
    role: Role;
    name: string;
    userId: string;
    poolId?: string;
    temporaryPassword?: string;
    sendWelcomeEmail: boolean;
  } = {
    email,
    name,
    poolId: userPoolId,
    role,
    sendWelcomeEmail: true,
    userId,
  };

  let dynamoUserInfo: RawUser = {
    email,
    entityName: 'User',
    isSeniorJudge,
    judgeFullName,
    judgeTitle,
    name,
    role,
    section,
    userId,
  };

  if (phone) {
    dynamoUserInfo = { ...dynamoUserInfo, contact: { phone } };
  }

  console.log('\nAdding user information to Cognito ... \n');

  await applicationContext
    .getUserGateway()
    .createUser(applicationContext, cognitoUserInfo);

  console.log('\nAdding user information to Dynamo ... \n');

  const rawUser = new User(dynamoUserInfo).validate().toRawObject();

  await applicationContext.getPersistenceGateway().createUserRecords({
    applicationContext,
    user: rawUser,
    userId: rawUser.userId,
  });

  console.log(
    `\nSuccess! Created Judge ${judgeFullName} with userId = ${userId} and email = ${email}.`,
  );
  console.log(
    'If you need to update this judge, run update-judge.ts using this email',
  );
})();

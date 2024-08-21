import * as client from '../../web-api/src/persistence/dynamodbClientService';
import { User } from '@shared/business/entities/User';
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
import { isEmpty } from 'lodash';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * This script will update the judge user in a deployed environment.
 * It updates both the Cognito record (if necessary) and the associated Dynamo record.
 * Required parameters: the current email of the judge to update
 * Optional parameters: --name, --judgeFullName, --email, --phone, --isSeniorJudge
 *
 *  Example usage:
 *
 * $ npx ts-node --transpile-only update-judge.ts 432143213-4321-1234-4321-432143214321 --name Way --judgeFullName "Kashi Way" --email judge.way@ustaxcourt.gov --phone "(123) 123-1234" --isSeniorJudge true
 */

function getArgValue(param: string): string {
  const args = process.argv.slice(3); // Skip the first three arguments (node, script path, and id)
  const index = args.indexOf(`--${param}`);

  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }

  return '';
}

requireEnvVars(['ENV']);

// eslint-disable-next-line @typescript-eslint/no-floating-promises, complexity
(async () => {
  const applicationContext = createApplicationContext();

  const currentEmail = process.argv[2];

  const updatedName = getArgValue('name');
  const updatedJudgeFullName = getArgValue('judgeFullName');
  const updatedEmail = getArgValue('email');
  const updatedPhone = getArgValue('phome');
  const updatedIsSeniorJudge = getArgValue('isSeniorJudge');

  if (
    updatedIsSeniorJudge &&
    !['true', 'false'].includes(updatedIsSeniorJudge)
  ) {
    throw new Error('\nisSeniorJudge must be blank or either true/false');
  }

  const userPoolId = await getUserPoolId();

  environment.userPoolId = userPoolId;
  const { tableName } = await getDestinationTableInfo();
  environment.dynamoDbTableName = tableName;

  console.log('\nGetting the Cognito record for the user ...');

  const cognitoResult = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email: currentEmail,
      poolId: userPoolId,
    });

  if (!cognitoResult) {
    throw new Error(`\nCannot find user with email ${currentEmail}`);
  }

  const { name, userId } = cognitoResult;

  // Check for mistaken emails
  if (
    updatedEmail &&
    !emailIsInExpectedFormat({
      email: updatedEmail,
      judgeName: updatedName || name,
    })
  ) {
    const userInput = await promptUser(
      `\nWarning: The email you entered does not match expected formats: ${expectedEmailFormats(updatedName || name).join(', ')}. Continue anyway? y/n `,
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }

  // Check for mistaken phone numbers
  if (updatedPhone && !phoneIsInExpectedFormat(updatedPhone)) {
    const userInput = await promptUser(
      '\nWarning: The phone number you entered does not match the expected format: (XXX) XXX-XXXX. Continue anyway? y/n ',
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }

  console.log('\nSetting up the updated Cognito user info ...');

  const cognitoAttributesToUpdate = {} as { name: string; email: string };

  if (updatedName) {
    cognitoAttributesToUpdate.name = updatedName;
  }

  if (updatedEmail) {
    cognitoAttributesToUpdate.email = updatedEmail;
  }

  if (!isEmpty(cognitoAttributesToUpdate)) {
    console.log('\nUpdating the user Cognito record ...');
    await applicationContext.getUserGateway().updateUser(applicationContext, {
      attributesToUpdate: cognitoAttributesToUpdate,
      email: currentEmail,
      poolId: userPoolId,
    });
  } else {
    console.log('\nNothing to update in Cognito, continuing ...');
  }

  console.log('\nSetting up the updated Dynamo user info ...');

  const updatedChambersSection = updatedName
    ? getChambersNameFromJudgeName(updatedName)
    : '';

  const dynamoUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  const oldSection = dynamoUser.section;

  dynamoUser.email = updatedEmail || dynamoUser.email;
  dynamoUser.name = updatedName || dynamoUser.name;
  dynamoUser.contact = updatedPhone
    ? { phone: updatedPhone }
    : dynamoUser.contact;
  dynamoUser.isSeniorJudge =
    updatedIsSeniorJudge.toLowerCase() === 'true' || dynamoUser.isSeniorJudge;
  dynamoUser.judgeFullName = updatedJudgeFullName || dynamoUser.judgeFullName;
  dynamoUser.section = updatedChambersSection || oldSection;

  const rawUser = new User(dynamoUser).validate().toRawObject();

  console.log('\nUpdating the Dynamo record ...');

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: rawUser,
  });

  if (updatedChambersSection) {
    console.log('\nChambers section needs to be updated.');

    console.log(`\nAdding a record for ${updatedChambersSection}`);

    await client.put({
      Item: {
        pk: `section|${updatedChambersSection}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });

    if (oldSection) {
      console.log(
        `\nUpdating members of ${oldSection} to be members of ${updatedChambersSection} ...`,
      );
      const chambersUsers: User[] = await applicationContext
        .getPersistenceGateway()
        .getUsersInSection({ applicationContext, section: oldSection });

      for (let chambersUser of chambersUsers) {
        chambersUser.section = updatedChambersSection;
        const rawChambersUser = new User(chambersUser).validate().toRawObject();
        await applicationContext.getPersistenceGateway().updateUser({
          applicationContext,
          user: rawChambersUser,
        });
      }

      console.log(`\nRemoving old chambers section ${oldSection} ...`);

      // TODO 10455: Would this cause any issues?
      await client.remove({
        applicationContext,
        key: {
          pk: `section|${oldSection}`,
          sk: `user|${userId}`,
        },
      });
    }
  }

  console.log(
    `\nSuccess! Updated Judge ${dynamoUser.judgeFullName}. Current email = ${dynamoUser.email}.`,
  );
  if (updatedChambersSection) {
    console.log(
      'Also re-pointed the judge and their chambers to the new chambers section ${updatedSection}.',
    );
  }
  console.log(
    'If you need to update this judge further (including an update to undo this update), run update-judge.ts using this email.',
  );
})();

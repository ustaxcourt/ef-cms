import * as client from '../../web-api/src/persistence/dynamodbClientService';
import * as readline from 'node:readline/promises';
import { User } from '@shared/business/entities/User';
import { createApplicationContext } from '@web-api/applicationContext';
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

const defaultEmailHost = 'ustaxcourt.gov';

const getChambersNameFromJudgeName = (judgeName: string) => {
  return judgeName.endsWith('s') ? '{name}Chambers' : '{name}sChambers';
};

async function promptUser(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question(query);
  rl.close();
  return answer;
}

const expectedEmailFormats = (name: string): string[] => {
  const lowerCaseName = name.toLowerCase();
  return [
    `stjudge.${lowerCaseName}@${defaultEmailHost}`,
    `judge.${lowerCaseName}@${defaultEmailHost}`,
  ];
};

const emailIsInExpectedFormat = ({
  email,
  name,
}: {
  name: string;
  email: string;
}): boolean => {
  return expectedEmailFormats(name).includes(email.toLowerCase());
};

const phoneIsInExpectedFormat = (phone: string) => {
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

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
    throw new Error('isSeniorJudge must be blank or either true/false');
  }

  const userPoolId = await getUserPoolId();

  environment.userPoolId = userPoolId;
  const { tableName } = await getDestinationTableInfo();
  environment.dynamoDbTableName = tableName;

  const cognitoResult = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email: currentEmail,
      poolId: userPoolId,
    });

  if (!cognitoResult) {
    throw new Error(`Cannot find user with email ${currentEmail}`);
  }

  const { name, userId } = cognitoResult;

  // Check for mistaken emails
  if (
    updatedEmail &&
    !emailIsInExpectedFormat({
      email: updatedEmail,
      name: updatedName || name,
    })
  ) {
    const userInput = await promptUser(
      `Warning: The email you entered does not match expected formats: ${expectedEmailFormats(updatedName || name).join(', ')}. Continue anyway? y/n `,
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }

  // Check for mistaken phone numbers
  if (updatedPhone && !phoneIsInExpectedFormat(updatedPhone)) {
    const userInput = await promptUser(
      'Warning: The phone number you entered does not match the expected format: (XXX) XXX-XXXX. Continue anyway? y/n ',
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }

  const cognitoAttributesToUpdate = {} as { name: string; email: string };

  if (updatedName) {
    cognitoAttributesToUpdate.name = updatedName;
  }

  if (updatedEmail) {
    cognitoAttributesToUpdate.email = updatedEmail;
  }

  if (!isEmpty(cognitoAttributesToUpdate)) {
    await applicationContext.getUserGateway().updateUser(applicationContext, {
      attributesToUpdate: cognitoAttributesToUpdate,
      email: currentEmail,
      poolId: userPoolId,
    });
  }

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

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: rawUser,
  });

  if (updatedChambersSection) {
    // First, create the updated judge's chambers section
    await client.put({
      Item: {
        pk: `section|${updatedChambersSection}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });

    if (oldSection) {
      // Then, for each member of their chambers section, re-point that member to the new chambers section
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

      // Finally, remove the old chambers section
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
    `Success! Updated Judge ${dynamoUser.judgeFullName}. Current email = ${dynamoUser.email}.`,
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

import * as client from '../../web-api/src/persistence/dynamodbClientService';
import { User } from '@shared/business/entities/User';
import { UserRecord } from '@web-api/persistence/dynamo/dynamoTypes';
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
 * Optional parameters (although at least one required): --name, --judgeFullName, --email, --phone, --isSeniorJudge
 *
 *  Example usage:
 *
 * $ npx ts-node --transpile-only update-judge.ts 432143213-4321-1234-4321-432143214321 --name Way --judgeFullName "Kashi Way" --email judge.way@ustaxcourt.gov --phone "(123) 123-1234" --isSeniorJudge true
 */

requireEnvVars(['ENV']);

const getArgValue = (param: string): string => {
  const args = process.argv.slice(3); // Skip the first three arguments (node, script path, and id)
  const index = args.indexOf(`--${param}`);
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }
  return '';
};

const validateUpdates = ({ updates }: { updates: Record<string, string> }) => {
  if (!Object.values(updates).some(update => update !== '')) {
    throw new Error('\nNothing to update!');
  }
  if (
    updates.isSeniorJudge &&
    !['true', 'false'].includes(updates.isSeniorJudge)
  ) {
    throw new Error('\nisSeniorJudge must be blank or either true/false');
  }
};

const updateCognitoRecord = async ({
  applicationContext,
  currentEmail,
  updates,
  userPoolId,
}: {
  updates: Record<string, string>;
  applicationContext: any;
  currentEmail: string;
  userPoolId: string;
}) => {
  console.log('\nSetting up the updated Cognito user info ...');

  const cognitoAttributesToUpdate = {} as { name: string; email: string };
  if (updates.name) {
    cognitoAttributesToUpdate.name = updates.name;
  }
  if (updates.email) {
    cognitoAttributesToUpdate.email = updates.email;
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
};

const updateDynamoRecords = async ({
  applicationContext,
  updates,
  userId,
}: {
  updates: Record<string, string>;
  userId: string;
  applicationContext: any;
}) => {
  console.log('\nGetting existing Dynamo record ...');

  const dynamoUser: UserRecord = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  const updatedChambersSection = updates.name
    ? getChambersNameFromJudgeName(updates.name)
    : '';
  const oldChambersSection = dynamoUser.section;

  await updateDynamoJudgeUserRecord({
    applicationContext,
    chambersSection: updatedChambersSection || oldChambersSection!,
    dynamoUser,
    updates,
  });

  if (updatedChambersSection) {
    await updateDynamoChambersRecords({
      applicationContext,
      oldChambersSection,
      updatedChambersSection,
      userId,
    });
  }
  return dynamoUser;
};

const updateDynamoJudgeUserRecord = async ({
  applicationContext,
  chambersSection,
  dynamoUser,
  updates,
}: {
  updates: Record<string, string>;
  dynamoUser: UserRecord;
  applicationContext: any;
  chambersSection: string;
}) => {
  console.log('\nUpdating the judge user Dynamo record ...');

  dynamoUser.email = updates.email || dynamoUser.email;
  dynamoUser.name = updates.name || dynamoUser.name;
  dynamoUser.contact = updates.phone
    ? { phone: updates.phone }
    : dynamoUser.contact;
  dynamoUser.isSeniorJudge =
    updates.isSeniorJudge != ''
      ? updates.isSeniorJudge.toLowerCase() === 'true'
      : dynamoUser.isSeniorJudge;
  dynamoUser.judgeFullName = updates.judgeFullName || dynamoUser.judgeFullName;
  dynamoUser.section = chambersSection;

  const rawUser = new User(dynamoUser).validate().toRawObject();

  console.log('\nUpdating the Dynamo record ...');

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: rawUser,
  });
};

const updateDynamoChambersRecords = async ({
  applicationContext,
  oldChambersSection,
  updatedChambersSection,
  userId,
}) => {
  console.log('\nChambers section needs to be updated.');
  console.log(`\nAdding a record for ${updatedChambersSection}`);

  await client.put({
    Item: {
      pk: `section|${updatedChambersSection}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });

  if (oldChambersSection) {
    console.log(
      `\nUpdating members of ${oldChambersSection} to be members of ${updatedChambersSection} ...`,
    );
    const chambersUsers: User[] = await applicationContext
      .getPersistenceGateway()
      .getUsersInSection({ applicationContext, section: oldChambersSection });

    for (let chambersUser of chambersUsers) {
      chambersUser.section = updatedChambersSection;
      const rawChambersUser = new User(chambersUser).validate().toRawObject();
      await applicationContext.getPersistenceGateway().updateUser({
        applicationContext,
        user: rawChambersUser,
      });
    }

    console.log(`\nRemoving old chambers section ${oldChambersSection} ...`);

    // TODO 10455: Would this cause any issues?
    await client.remove({
      applicationContext,
      key: {
        pk: `section|${oldChambersSection}`,
        sk: `user|${userId}`,
      },
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises, complexity
(async () => {
  const applicationContext = createApplicationContext();

  const currentEmail = process.argv[2];

  const updates = {
    email: getArgValue('email'),
    isSeniorJudge: getArgValue('isSeniorJudge'),
    judgeFullName: getArgValue('judgeFullName'),
    name: getArgValue('name'),
    phone: getArgValue('phone'),
  };
  validateUpdates({ updates });

  const userPoolId = await getUserPoolId();
  environment.userPoolId = userPoolId;
  const { tableName } = await getDestinationTableInfo();
  environment.dynamoDbTableName = tableName;

  console.log('\nGetting the Cognito record for the user ...');

  const existingCognitoRecord = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email: currentEmail,
      poolId: userPoolId,
    });

  if (!existingCognitoRecord) {
    throw new Error(`\nCannot find user with email ${currentEmail}`);
  }

  const { name: currentName, userId } = existingCognitoRecord;

  if (
    updates.email &&
    !emailIsInExpectedFormat({
      email: updates.email,
      judgeName: updates.name || currentName,
    })
  ) {
    const userInput = await promptUser(
      `\nWarning: The email you entered does not match expected formats: ${expectedEmailFormats(updates.name || currentName).join(', ')}. Continue anyway? y/n `,
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }
  if (updates.phone && !phoneIsInExpectedFormat(updates.phone)) {
    const userInput = await promptUser(
      '\nWarning: The phone number you entered does not match the expected format: (XXX) XXX-XXXX. Continue anyway? y/n ',
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }

  await updateCognitoRecord({
    applicationContext,
    currentEmail,
    updates,
    userPoolId,
  });

  const updatedDynamoUser = await updateDynamoRecords({
    applicationContext,
    updates,
    userId,
  });

  console.log(
    `\nSuccess! Updated Judge ${updatedDynamoUser.judgeFullName}. Current email = ${updatedDynamoUser.email}.`,
  );
  console.log(
    'If you need to update this judge further (including an update to undo this update), run update-judge.ts using this email.',
  );
})();

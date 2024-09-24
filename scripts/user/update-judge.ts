#!/usr/bin/env npx ts-node --transpile-only
import * as client from '../../web-api/src/persistence/dynamodbClientService';
import { JudgeTitle } from '@shared/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';
import { UserRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { createApplicationContext } from '@web-api/applicationContext';
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
import { isEmpty } from 'lodash';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * This script will update the judge user in a deployed environment.
 * It updates both the Cognito record (if necessary) and the associated Dynamo record.
 * Required parameters: the current email of the judge to update
 * Optional parameters (although at least one required): --judgeTitle, --email, --phone, --isSeniorJudge
 * There is some initial logic for updating --name, but testing has revealed more that needs done so it is not yet supported.
 *
 *  Example usage:
 *
 * $ npx ts-node --transpile-only update-judge.ts judge.someone@ustaxcourt.gov --judgeTitle Judge --email judge.way@ustaxcourt.gov --phone "(123) 123-1234" --isSeniorJudge true
 *
 * Note that this script SHOULD be temporary: it is meant as a slight improvement from the current ill-defined process.
 * Please extract into application logic!
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
  if (updates.name || updates.judgeFullName) {
    // There is logic in place to update the judge and chambers records.
    // However, we need to update messages, cases, etc. to use the new name as well.
    throw new Error('Updating the judge name is currently not supported.');
  }
  if (!Object.values(updates).some(update => update !== '')) {
    throw new Error('Nothing to update!');
  }
  if (
    updates.isSeniorJudge &&
    !['true', 'false'].includes(updates.isSeniorJudge)
  ) {
    throw new Error('isSeniorJudge must be blank or either true/false');
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
  console.log('Setting up the updated Cognito user info ...');
  const cognitoAttributesToUpdate = {} as { name: string; email: string };
  if (updates.name) {
    cognitoAttributesToUpdate.name = updates.name;
  }
  if (updates.email) {
    cognitoAttributesToUpdate.email = updates.email;
  }
  if (!isEmpty(cognitoAttributesToUpdate)) {
    console.log('Updating the user Cognito record ...');
    await applicationContext.getUserGateway().updateUser(applicationContext, {
      attributesToUpdate: cognitoAttributesToUpdate,
      email: currentEmail,
      poolId: userPoolId,
    });
  } else {
    console.log('Nothing to update in Cognito, continuing ...');
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
  console.log('Getting existing Dynamo record ...');
  const dynamoUser: UserRecord = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  // If the name is updated, then we will need to update the chambers section
  const oldChambersSection = dynamoUser.section;
  const updatedChambersSection =
    updates.name && updates.name != dynamoUser.name // No need to update if same name
      ? getChambersNameFromJudgeName(updates.name)
      : '';

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
  console.log('Updating the judge user Dynamo record ...');
  dynamoUser.email = updates.email || dynamoUser.email;
  dynamoUser.name = updates.name || dynamoUser.name;
  dynamoUser.judgePhoneNumber = updates.phone
    ? updates.phone
    : dynamoUser.judgePhoneNumber;
  dynamoUser.isSeniorJudge =
    updates.isSeniorJudge != ''
      ? updates.isSeniorJudge.toLowerCase() === 'true'
      : dynamoUser.isSeniorJudge;
  dynamoUser.judgeFullName = updates.judgeFullName || dynamoUser.judgeFullName;
  dynamoUser.section = chambersSection;
  dynamoUser.judgeTitle =
    (updates.judgeTitle as JudgeTitle) || dynamoUser.judgeTitle;

  const rawUser = new User(dynamoUser).validate().toRawObject();

  console.log('Updating the Dynamo record ...');
  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: rawUser,
  });
};

const createUserChambersSectionRecord = async ({
  applicationContext,
  chambersSection,
  userId,
}) => {
  await client.put({
    Item: {
      pk: `section|${chambersSection}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });
};

const updateDynamoChambersRecords = async ({
  applicationContext,
  oldChambersSection,
  updatedChambersSection,
  userId,
}) => {
  console.log('Chambers section needs to be updated.');
  console.log(`Adding a record for ${updatedChambersSection}`);
  // If there is no old chambers section, we only need to add the section record
  if (!oldChambersSection) {
    await createUserChambersSectionRecord({
      applicationContext,
      chambersSection: updatedChambersSection,
      userId,
    });
    return;
  }

  // Otherwise, we need to update existing records for every chambers member, including the judge
  console.log(
    `Updating members of ${oldChambersSection} to be members of ${updatedChambersSection} ...`,
  );
  const chambersUsers: User[] = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({ applicationContext, section: oldChambersSection });

  for (let chambersUser of chambersUsers) {
    console.log(`Updating ${chambersUser.role} user ${chambersUser.userId}`);
    chambersUser.section = updatedChambersSection;
    const rawChambersUser = new User(chambersUser).validate().toRawObject();

    // Update the user record, create the section record, and remove the old section record
    await applicationContext.getPersistenceGateway().updateUser({
      applicationContext,
      user: rawChambersUser,
    });
    await createUserChambersSectionRecord({
      applicationContext,
      chambersSection: updatedChambersSection,
      userId: chambersUser.userId,
    });
    await client.remove({
      applicationContext,
      key: {
        pk: `section|${oldChambersSection}`,
        sk: `user|${chambersUser.userId}`,
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
    judgeTitle: getArgValue('judgeTitle'),
    name: getArgValue('name'),
    phone: getArgValue('phone'),
  };
  validateUpdates({ updates });

  const userPoolId = await getUserPoolId();
  environment.userPoolId = userPoolId;
  const { tableName } = await getDestinationTableInfo();
  environment.dynamoDbTableName = tableName;

  console.log('Getting the Cognito record for the user ...');
  const existingCognitoRecord = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email: currentEmail,
      poolId: userPoolId,
    });

  if (!existingCognitoRecord) {
    throw new Error(`Cannot find user with email ${currentEmail}`);
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
      `Warning: The email you entered does not match expected formats: ${expectedEmailFormats(updates.name || currentName).join(', ')}. Continue anyway? y/n `,
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }
  if (updates.phone && !phoneIsInExpectedFormat(updates.phone)) {
    const userInput = await promptUser(
      'Warning: The phone number you entered does not match the expected format: (XXX) XXX-XXXX. Continue anyway? y/n ',
    );
    if (userInput.toLowerCase() !== 'y') {
      return;
    }
  }
  if (updates.judgeTitle && !judgeTitleIsInExpectedFormat(updates.judgeTitle)) {
    const userInput = await promptUser(
      `Warning: The judgeTitle you entered does not match expected values: ${expectedJudgeTitles.join(', ')}. Continue anyway? y/n `,
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
    `\n\nSuccess! Updated Judge ${updatedDynamoUser.judgeFullName}. Current email = ${updatedDynamoUser.email}.`,
  );
  console.log(
    'If you need to update this judge further (including an update to undo this update), run update-judge.ts using this email.\n\n',
  );
})();

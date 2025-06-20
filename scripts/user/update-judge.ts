#!/usr/bin/env -S npx ts-node --transpile-only

import { JudgeTitle } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { RawUser, User } from '@shared/business/entities/User';
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
import { getUserPoolId } from '../../shared/admin-tools/util';
import { isEmpty } from 'lodash';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { updateUser as updateUserFromPersistence } from '@web-api/persistence/postgres/users/updateUser';
import { getUsersInSections } from '@web-api/persistence/postgres/users/getUsersInSection';

/**
 * This script will update the judge user in a deployed environment.
 * It updates both the Cognito record (if necessary) and the associated Postgres record.
 * Required parameters: the current email of the judge to update
 * Optional parameters (although at least one required): --judgeTitle, --email, --phone, --isSeniorJudge
 * There is some initial logic for updating --name, but testing has revealed more that needs done so it is not yet supported.
 *
 *  Example usage:
 *
 * $ ./scripts/user/update-judge.ts judge.someone@ustaxcourt.gov --judgeTitle Judge --email judge.way@ustaxcourt.gov --phone "(123) 123-1234" --isSeniorJudge true
 *
 * Note that this script SHOULD be temporary: it is meant as a slight improvement from the current ill-defined process.
 * Please extract into application logic!
 */

const scriptConfig: ScriptConfig = {
  description:
    'update-judge - Updates an existing Judge user in a deployed environment.',
  environment: {
    env: 'ENV',
    userPoolId: 'USER_POOL_ID',
  },
  parameters: {
    currentEmail: {
      position: 0,
      required: true,
      type: 'string',
    },
    email: {
      type: 'string',
    },
    isSeniorJudge: {
      default: false,
      short: 's',
      type: 'boolean',
    },
    judgeFullName: {
      type: 'string',
    },
    judgeTitle: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
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

const updatePostgresRecords = async ({
  updates,
  userId,
}: {
  updates: Record<string, string>;
  userId: string;
}) => {
  console.log('Getting existing Postgres record ...');
  const postgresUser = await getUserById({ userId });
  if (!postgresUser) {
    throw new Error(`Could not find user with id ${userId}`);
  }

  // If the name is updated, then we will need to update the chambers section
  const oldChambersSection = postgresUser.section;
  const updatedChambersSection =
    updates.name && updates.name != postgresUser.name // No need to update if same name
      ? getChambersNameFromJudgeName(updates.name)
      : '';

  await updatePostgresJudgeUserRecord({
    chambersSection: updatedChambersSection || oldChambersSection!,
    postgresUser: postgresUser.toRawObject(),
    updates,
  });

  if (updatedChambersSection) {
    await updatePostgresChambersRecords({
      oldChambersSection,
      updatedChambersSection,
    });
  }
  return postgresUser;
};

const updatePostgresJudgeUserRecord = async ({
  chambersSection,
  postgresUser,
  updates,
}: {
  updates: Record<string, string>;
  postgresUser: RawUser;
  chambersSection: string;
}) => {
  console.log('Updating the judge user Postgres record ...');
  postgresUser.email = updates.email || postgresUser.email;
  postgresUser.name = updates.name || postgresUser.name;
  postgresUser.judgePhoneNumber = updates.phone
    ? updates.phone
    : postgresUser.judgePhoneNumber;
  postgresUser.isSeniorJudge =
    updates.isSeniorJudge != ''
      ? updates.isSeniorJudge.toLowerCase() === 'true'
      : postgresUser.isSeniorJudge;
  postgresUser.judgeFullName =
    updates.judgeFullName || postgresUser.judgeFullName;
  postgresUser.section = chambersSection;
  postgresUser.judgeTitle =
    (updates.judgeTitle as JudgeTitle) || postgresUser.judgeTitle;

  const rawUser = new User(postgresUser).validate().toRawObject();

  console.log('Updating the Postgres record ...');
  await updateUserFromPersistence({ userToUpdate: rawUser });
};

const updatePostgresChambersRecords = async ({
  oldChambersSection,
  updatedChambersSection,
}) => {
  console.log('Chambers section needs to be updated.');
  console.log(`Adding a record for ${updatedChambersSection}`);
  // If there is no old chambers section, we only need to add the section record
  if (!oldChambersSection) {
    return;
  }

  // Otherwise, we need to update existing records for every chambers member, including the judge
  console.log(
    `Updating members of ${oldChambersSection} to be members of ${updatedChambersSection} ...`,
  );
  const chambersUsers: User[] = await getUsersInSections({
    sections: [oldChambersSection],
  });

  for (const chambersUser of chambersUsers) {
    console.log(`Updating ${chambersUser.role} user ${chambersUser.userId}`);
    chambersUser.section = updatedChambersSection;
    const rawChambersUser = new User(chambersUser).validate().toRawObject();

    // Update the user record, create the section record, and remove the old section record
    await updateUserFromPersistence({
      userToUpdate: rawChambersUser,
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext();

  const {
    currentEmail,
    email,
    isSeniorJudge,
    judgeFullName,
    judgeTitle,
    name,
    phone,
  } = parseArgsAndEnvVars(scriptConfig) as {
    currentEmail: string;
    email: string;
    isSeniorJudge: boolean;
    judgeFullName: string;
    judgeTitle: string;
    name: string;
    phone: string;
  };

  const updates = {
    email,
    isSeniorJudge: isSeniorJudge ? 'true' : 'false',
    judgeFullName,
    judgeTitle,
    name,
    phone,
  };
  validateUpdates({ updates });

  const userPoolId = await getUserPoolId();
  environment.userPoolId = userPoolId;

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

  const updatedPostgresUser = await updatePostgresRecords({
    updates,
    userId,
  });

  console.log(
    `\n\nSuccess! Updated Judge ${updatedPostgresUser.judgeFullName}. Current email = ${updatedPostgresUser.email}.`,
  );
  console.log(
    'If you need to update this judge further (including an update to undo this update), run update-judge.ts using this email.\n\n',
  );
})();

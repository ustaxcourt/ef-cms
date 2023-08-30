import {
  AttributeType,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { BatchGetItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { chunk } from 'lodash';
import { readFileSync, writeFileSync } from 'fs';
import { unmarshall } from '@aws-sdk/util-dynamodb';

// this script is going to get all of the cognito accounts and perform the following actions
//
// 1. look for dupes (combinations of the same email address)
// 2. where the email address doesn't exist in the database

const allUsersFilename = './all-users.json';

const cognitoClient = new CognitoIdentityProviderClient({
  region: 'us-east-1',
});
const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
});

const getAttribute = (
  name: string,
  attributes: AttributeType[],
): string | undefined => {
  if (!attributes) return;
  const found = attributes.find(attr => attr.Name === name);
  if (!found) return;
  return found.Value;
};

type CognitoUserBase = {
  email: string;
  userId: string;
};

const parseCognitoRecord = (item: UserType): CognitoUserBase => {
  if (!item.Attributes) {
    console.log({ item });
    throw new Error('Missing required Attributes for Cognito record');
  }

  const email = getAttribute('email', item.Attributes);
  if (!email) {
    console.log({ item });
    throw new Error('Cognito record is missing email!');
  }

  let userId = getAttribute('custom:userId', item.Attributes);
  if (!userId) {
    userId = getAttribute('sub', item.Attributes);
  }
  if (!userId) {
    console.log({ item });
    throw new Error('Cognito record is missing email!');
  }
  return { email, userId };
};
const users = {};
const allLowerCaseUsers: string[] = [];
const allLowerCaseDupes: string[] = [];
let allUsers: CognitoUserBase[] = [];

const processCognitoRecord = (user: CognitoUserBase) => {
  const lowerCaseEmail = user.email.toLowerCase();

  if (!users[lowerCaseEmail]) {
    users[lowerCaseEmail] = [];
  }
  users[lowerCaseEmail].push(user);

  if (allLowerCaseUsers.includes(lowerCaseEmail)) {
    allLowerCaseDupes.push(lowerCaseEmail);
  } else {
    allLowerCaseUsers.push(lowerCaseEmail);
  }
};

const getUsersFromJson = () => {
  const jsonUsers = readFileSync(allUsersFilename, 'utf-8');
  allUsers = JSON.parse(jsonUsers);
  console.log('processing users');
  let count = 0;
  console.log(allUsers.length);
  for (const user of allUsers) {
    processCognitoRecord(user);
    count++;
    if (count % 1000) {
      console.log(`processed ${count} items`);
    }
  }
  console.log('done processing users');
  return Promise.resolve();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUsers = async (PaginationToken?: string) => {
  const input = {
    Limit: 60,
    PaginationToken,
    UserPoolId: process.env.COGNITO_USER_POOL,
  };
  const command = new ListUsersCommand(input);
  const response = await cognitoClient.send(command);

  if (response.Users) {
    for (const item of response.Users) {
      const user = parseCognitoRecord(item);
      allUsers.push(user);
      processCognitoRecord(user);
    }
  }

  console.log(`🤖 ${allUsers.length} total users`);

  if (response.PaginationToken) {
    await getUsers(response.PaginationToken);
  }
};

const checkDatabase = async (usersToCheck: CognitoUserBase[]) => {
  const tableName: string = process.env.DYNAMODB_TABLE_NAME!;
  const command = new BatchGetItemCommand({
    RequestItems: {
      [tableName]: {
        Keys: usersToCheck.map(user => ({
          pk: {
            S: `user|${user.userId}`,
          },
          sk: {
            S: `user|${user.userId}`,
          },
        })),
        ProjectionExpression: 'email,userId',
      },
    },
  });

  const response = await dynamoClient.send(command);

  if (!response.Responses) {
    throw new Error('No items found');
  }

  for (const resp of response.Responses[tableName]) {
    const item = unmarshall(resp);
    const user = usersToCheck.find(u => u.userId === item.userId)!;

    if (item.email !== user.email) {
      console.log('❗ Emails do not match for user', { item, user });
    } else {
      // console.log(`✅ emails match for user ${user.userId}`);
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const verifyEmails = async () => {
  const chunks = chunk(allUsers, 100);
  for (const chunkOfUsers of chunks) {
    try {
      await checkDatabase(chunkOfUsers);
    } catch (err) {
      console.error(err);
    }
  }
};

const reportDupes = () => {
  for (const dupe of allLowerCaseDupes) {
    console.log(users[dupe]);
  }
};

const initReport = () => {
  console.log(
    `starting with ${allUsers.length} total users; ${allLowerCaseDupes.length} total dupes`,
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const saveUsers = () => {
  writeFileSync(allUsersFilename, JSON.stringify(allUsers), 'utf8');
};

// getUsers()
getUsersFromJson()
  // .then(saveUsers)
  .then(initReport)
  .then(reportDupes)
  // .then(verifyEmails)
  .then(() => {
    console.log('done');
  });

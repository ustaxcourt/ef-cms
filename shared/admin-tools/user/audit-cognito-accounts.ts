import {
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AttributeType,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  BatchGetItemCommand,
  DynamoDBClient,
  QueryCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { chunk } from 'lodash';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { ROLES } from '@shared/business/entities/EntityConstants';

// this script is going to get all of the cognito accounts and perform the following actions
//
// 1. look for dupes (combinations of the same email address)
// 2. where the email address doesn't exist in the database

const allUsersFilename = './all-users.json';
const dupeUsersFilename = './dupe-users.json';

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
  userId?: string;
  status?: string;
  sub?: string;
  role?: string;
  numCases?: number;
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

  const userId = getAttribute('custom:userId', item.Attributes);
  const sub = getAttribute('sub', item.Attributes);
  const role =
    getAttribute('custom:role', item.Attributes) || 'petitioner-assumed';
  if (!userId && !sub) {
    console.log({ item });
    throw new Error('Cognito record is missing an id!');
  }
  return { email, role, status: item.UserStatus, sub, userId };
};

const processCognitoRecord = ({
  allLowerCaseDupes,
  allLowerCaseUsers,
  distinctUsers,
  user,
}) => {
  const lowerCaseEmail = user.email.toLowerCase();

  if (!distinctUsers[lowerCaseEmail]) {
    distinctUsers[lowerCaseEmail] = [];
  }
  distinctUsers[lowerCaseEmail].push(user);

  if (!allLowerCaseUsers.includes(lowerCaseEmail)) {
    allLowerCaseUsers.push(lowerCaseEmail);
  } else if (!allLowerCaseDupes.includes(lowerCaseEmail)) {
    allLowerCaseDupes.push(lowerCaseEmail);
  }
};

const getUsersFromJson = () => {
  const jsonUsers = readFileSync(allUsersFilename, 'utf-8');
  const allUsers = JSON.parse(jsonUsers);
  return allUsers;
};

const getDupesFromJson = () => {
  const jsonUsers = readFileSync(dupeUsersFilename, 'utf-8');
  const dupeUsers = JSON.parse(jsonUsers);
  return dupeUsers as CognitoUserBase[][];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const getUsersFromCognito = async (
  PaginationToken?: string,
): Promise<CognitoUserBase[]> => {
  const allUsers: CognitoUserBase[] = [];

  const input = {
    Limit: 60,
    PaginationToken,
    UserPoolId: process.env.COGNITO_USER_POOL,
  };
  const command = new ListUsersCommand(input);
  const response = await cognitoClient.send(command);

  if (response.Users) {
    for (const item of response.Users) {
      if (!item.Enabled) continue;
      const user = parseCognitoRecord(item);
      allUsers.push(user);
    }
  }

  if (response.PaginationToken) {
    console.log('fetching new page...');
    const moreUsers = await getUsersFromCognito(response.PaginationToken);
    const usersSoFar = allUsers.concat(moreUsers);
    return usersSoFar;
  } else {
    console.log(`last page :) found this many users: ${allUsers.length}`);
  }

  return allUsers;
};

const getUsers = async (
  refreshCache: boolean = false,
): Promise<CognitoUserBase[]> => {
  if (existsSync(allUsersFilename) && !refreshCache) {
    return getUsersFromJson();
  } else {
    const allUsers = await getUsersFromCognito();
    saveUsers(allUsers);
    return allUsers;
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
const verifyEmails = async (allUsers: CognitoUserBase[]) => {
  const chunks = chunk(allUsers, 100);
  for (const chunkOfUsers of chunks) {
    try {
      await checkDatabase(chunkOfUsers);
    } catch (err) {
      console.error(err);
    }
  }
};

const reportDupes = ({ allLowerCaseDupes, distinctUsers }) => {
  if (allLowerCaseDupes.length > 0) {
    for (const dupe of allLowerCaseDupes) {
      console.log(distinctUsers[dupe]);
    }
  } else {
    console.log("✅ there aren't any duplicate emails to worry about");
  }
};

const initReport = allUsers => {
  console.log(`starting with ${allUsers.length} total users`);
  return allUsers;
};

const dedupeUser = async (dupeUsers: CognitoUserBase[]): Promise<void> => {
  // check to see if user has any cases
  let numUsersWithCases = dupeUsers.filter(
    dupeUser => dupeUser.numCases && dupeUser.numCases > 0,
  ).length;

  if (numUsersDeleted > 0) {
    // return;
  }

  if (numUsersWithCases > 1) {
    console.log('this user has a case with more than one account', dupeUsers);
  } else if (numUsersWithCases === 1) {
    console.log('this user has a case with only one account', dupeUsers);
    // await dedupeUserWithOneCase(dupeUsers);
  } else {
    console.log('none of the users have any cases', dupeUsers);
    // await dedupeUserWithNoCases(dupeUsers);
    // for (let i = 1; i < dupeUsers.length; i++) {
    //   await removeAccount(dupeUsers[i]);
    // }
    // do nothing
  }

  // if none of the users have a case
};

const dedupeUserWithNoCases = async (dupeUsers: CognitoUserBase[]) => {
  console.log('deduping user with no cases', dupeUsers);
  numUsersDeleted++;

  // keep the user that has a role of privatePractitioner or irsPractitioner
  const keepUser = dupeUsers.find(
    user =>
      user.role === ROLES.privatePractitioner ||
      user.role === ROLES.irsPractitioner ||
      user.status === 'FORCE_CHANGE_PASSWORD',
  );

  if (keepUser) {
    // remove all accounts except the one with a role of privatePractitioner or irsPractitioner
    for (let i = dupeUsers.length - 1; i >= 0; i--) {
      if (dupeUsers[i].sub !== keepUser.sub) {
        await removeAccount(dupeUsers[i]);
      }
    }
  } else {
    // remove all accounts except the first one
    for (let i = dupeUsers.length - 1; i > 0; i--) {
      await removeAccount(dupeUsers[i]);
    }
  }
};

const checkCases = async (userId: string) => {
  const tableName: string = process.env.DYNAMODB_TABLE_NAME!;
  const command = new QueryCommand({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': {
        S: `user|${userId}`,
      },
      ':sk': {
        S: 'case|',
      },
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :sk)',
    Select: 'COUNT',
    TableName: tableName,
  });

  const response = await dynamoClient.send(command);

  return response?.Count || 0;
};

const dedupeUserWithOneCase = async (dupeUsers: CognitoUserBase[]) => {
  // loop through users that don't have any cases, and remove them
  for (const dupeUser of dupeUsers) {
    if (dupeUser.numCases === 0) {
      await removeAccount(dupeUser);
    }
  }
};

const removeAccount = async (dupeUser: CognitoUserBase) => {
  if (
    [
      'mjm@martinoliveira.com',
      'david@tgitax.com',
      'RICHARD@RQHLAW.COM',
    ].includes(dupeUser.email)
  ) {
    console.log('not removing', dupeUser);
    return;
  }

  console.log('remove account!', dupeUser);

  const tableName: string = process.env.DYNAMODB_TABLE_NAME!;
  try {
    const command = new DeleteItemCommand({
      Key: {
        pk: {
          S: `user|${dupeUser.userId || dupeUser.sub}`,
        },
        sk: {
          S: `user|${dupeUser.userId || dupeUser.sub}`,
        },
      },
      TableName: tableName,
    });

    const result = await dynamoClient.send(command);
    // console.log('delete user from dynamo', result);
  } catch (err) {
    console.error(err);
  }

  try {
    // remove cognito record
    const disableUserCommand = new AdminDisableUserCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: dupeUser.email,
    });
    const result = await cognitoClient.send(disableUserCommand);
    // console.log('disable user from cognito', result);
  } catch (err) {
    console.error(err);
  }

  try {
    const deleteUserCommand = new AdminDeleteUserCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: dupeUser.email,
    });
    const result = await cognitoClient.send(deleteUserCommand);
    // console.log('delete user from cognito', result);
  } catch (err) {
    console.error(err);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const saveUsers = allUsers => {
  writeFileSync(allUsersFilename, JSON.stringify(allUsers), 'utf8');
  return allUsers;
};

const saveParsedUsers = dupeUsers => {
  writeFileSync(dupeUsersFilename, JSON.stringify(dupeUsers), 'utf8');
  return dupeUsers;
};

let numUsersDeleted = 0;

const processUsers = ({
  allLowerCaseDupes,
  allLowerCaseUsers,
  allUsers,
  distinctUsers,
}) => {
  let count = 0;
  for (const user of allUsers) {
    count++;
    if (count % 1000) {
      console.log(
        `processed ${count}/${allUsers.length} (${Math.round(100 * (count / allUsers.length)) / 100}%) items`,
      );
    }
    processCognitoRecord({
      allLowerCaseDupes,
      allLowerCaseUsers,
      distinctUsers,
      user,
    });
  }
};

void (async () => {
  const allUsers = await getUsers(true); // refresh cache?

  const allLowerCaseDupes = [];
  const allLowerCaseUsers = [];
  const distinctUsers = [];

  await processUsers({
    allLowerCaseDupes,
    allLowerCaseUsers,
    allUsers,
    distinctUsers,
  });

  // for (const user of allUsers) {
  //   // echo out any role that is not petitioner, irsPractitioner, or privatePractitioner

  //   if (user.userId && courtUsers.includes(user.userId)) {
  //     console.log(user);
  //   }
  // }

  // allDupes.forEach(dupeUsers => {
  //   console.log('dupe user', dupeUsers);
  // });

  for (const emailAddress of allLowerCaseDupes) {
    //   if (emailAddress.includes('@ustaxcourt.gov')) {
    //     // console.log('court user', distinctUsers[emailAddress]);
    //   } else {
    await dedupeUser(distinctUsers[emailAddress]);
    //   }
  }
  // for (const user of dupeUsers) {
  //   const userId = user.userId || user.sub;
  //   if (!userId) {
  //     throw new Error("don't have a userId to check");
  //   }
  //   user.numCases = await checkCases(userId);
  //   if (user.numCases) {
  //     numUsersWithCases++;
  //   }
  // }
  // const dupeUsers: CognitoUserBase[][] = getDupesFromJson();
  // for (const dupeUser of dupeUsers) {
  //   if (dupeUser[0].email.includes('@ustaxcourt.gov')) {
  //     continue;
  //   }
  //   await dedupeUser(dupeUser);
  // }
  // // console.log(allDupes);
  // console.log('done processing users');
  // reportDupes({ allLowerCaseDupes, distinctUsers });
  // console.log(`done ${allLowerCaseDupes.length} total duplicate users`);

  // await removeAccount({
  //   email: 'Michelleunderwood@ymail.com',
  //   role: 'petitioner-assumed',
  //   status: 'CONFIRMED',
  //   sub: '0ba20d06-ba55-4d0f-8c8c-52cb4ebd1a76',
  // });
})();

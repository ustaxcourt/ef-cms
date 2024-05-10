import {
  AttributeType,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const allUsersFilename = './all-users.json';

const cognitoClient = new CognitoIdentityProviderClient({
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const saveUsers = allUsers => {
  writeFileSync(allUsersFilename, JSON.stringify(allUsers), 'utf8');
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

const dedupeUser = (dupeUsers: CognitoUserBase[]): void => {
  // check to see if user has any cases
  let numUsersWithCases = dupeUsers.filter(
    dupeUser => dupeUser.numCases && dupeUser.numCases > 0,
  ).length;

  if (numUsersWithCases > 1) {
    console.log('this user has a case with more than one account', dupeUsers);
  } else if (numUsersWithCases === 1) {
    console.log('this user has a case with only one account', dupeUsers);
  } else {
    console.log('none of the users have any cases', dupeUsers);
  }
};

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
        `processed ${count}/${allUsers.length} (${Math.round(100 * (count / allUsers.length))}%) items`,
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

  if (allLowerCaseDupes.length > 0) {
    for (const emailAddress of allLowerCaseDupes) {
      dedupeUser(distinctUsers[emailAddress]);
    }
  } else {
    console.log('There are no duplicate emails!', {
      allLowerCaseDupes,
      totalDistinctUsers: distinctUsers.length,
      totalLowerCaseUsers: allLowerCaseUsers.length,
      totalUsers: allUsers.length,
    });
  }
})();

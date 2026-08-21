import {
  CognitoIdentityProvider,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { deleteUserFromCognito, getAllCognitoUsers } from '../helpers/cognito';
import { runInBatches } from '../helpers/batch';

/**
 * Deletes every user in the given Cognito user pool. Lists users in pages,
 * then issues `AdminDeleteUser` commands in concurrency-limited batches via
 * the existing `runInBatches` helper.
 */
export const truncateAllCognitoUsers = async ({
  cognito,
  UserPoolId,
}: {
  cognito: CognitoIdentityProvider;
  UserPoolId: string;
}): Promise<number> => {
  const allUsers: UserType[] = await getAllCognitoUsers({
    cognito,
    UserPoolId,
  });

  const tasks: (() => Promise<boolean>)[] = allUsers.map(
    user => () => deleteUserFromCognito({ cognito, user, UserPoolId }),
  );

  await runInBatches(tasks);

  console.log(`Submitted delete for ${allUsers.length} Cognito user(s).`);
  return allUsers.length;
};

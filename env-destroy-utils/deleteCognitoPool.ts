import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export const deleteCognitoPool = async ({ environment }) => {
  const cognito = new CognitoIdentityProvider({
    region: environment.region,
  });
  const { UserPools } = await cognito.listUserPools({ MaxResults: 60 });
  if (!UserPools) return;
  const poolIdsToDelete = UserPools.filter(
    pool => pool.Name?.includes(environment.name),
  ).map(pool => pool.Id);
  for (let poolId of poolIdsToDelete) {
    const { UserPool } = await cognito.describeUserPool({ UserPoolId: poolId });
    if (!UserPool) {
      continue;
    }
    await cognito.deleteUserPoolDomain({
      Domain: UserPool.Domain,
      UserPoolId: poolId,
    });
    await cognito.deleteUserPool({
      UserPoolId: poolId,
    });
  }
};

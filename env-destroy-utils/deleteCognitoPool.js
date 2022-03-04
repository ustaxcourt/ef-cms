const { CognitoIdentityServiceProvider } = require('aws-sdk');

exports.deleteCognitoPool = async ({ environment }) => {
  const cognito = new CognitoIdentityServiceProvider({
    region: environment.region,
  });
  const { UserPools } = await cognito
    .listUserPools({ MaxResults: 60 })
    .promise();
  const poolIdsToDelete = UserPools.filter(pool =>
    pool.Name.includes(environment.name),
  ).map(pool => pool.Id);
  for (let poolId of poolIdsToDelete) {
    const { UserPool } = await cognito
      .describeUserPool({ UserPoolId: poolId })
      .promise();
    await cognito
      .deleteUserPoolDomain({
        Domain: UserPool.Domain,
        UserPoolId: poolId,
      })
      .promise();
    await cognito
      .deleteUserPool({
        UserPoolId: poolId,
      })
      .promise();
  }
};

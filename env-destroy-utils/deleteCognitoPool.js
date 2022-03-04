const { CognitoIdentityServiceProvider } = require('aws-sdk');
const cognito = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

exports.deleteCognitoPool = async () => {
  const { UserPools } = await cognito
    .listUserPools({ MaxResults: 60 })
    .promise();
  const poolIdsToDelete = UserPools.filter(pool =>
    pool.Name.includes('stg'),
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

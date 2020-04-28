const { filter } = require('lodash');

exports.getCognitoPools = async ({ cognito, environment }) => {
  const { IdentityPools } = await cognito
    .listIdentityPools({ MaxResults: 10 })
    .promise();
  return filter(IdentityPools, pool => {
    return pool.IdentityPoolName.includes(`-${environment.name}`);
  });
};

const { filter } = require('lodash');

exports.getCognitoPools = async ({ cognito, environment }) => {
  const { IdentityPools } = await cognito.listIdentityPools({}).promise();
  return filter(IdentityPools, pool => {
    return pool.IdentityPoolName.includes(`-${environment.name}`);
  });
};

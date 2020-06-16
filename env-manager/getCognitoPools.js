const { filter } = require('lodash');

exports.getCognitoPools = async ({ cognito, environment }) => {
  const { UserPools } = await cognito
    .listUserPools({ MaxResults: 10 })
    .promise();
  return filter(UserPools, pool => {
    return pool.Name.includes(`-${environment.name}`);
  });
};

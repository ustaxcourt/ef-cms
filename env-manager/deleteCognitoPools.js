const { exec } = require('child_process');
const { getCognito } = require('./getCognito');
const { getCognitoPools } = require('./getCognitoPools');
const { sleep } = require('./sleep');

exports.deleteCognitoPools = async ({ environment }) => {
  const cognito = getCognito({ environment });

  const pools = await getCognitoPools({
    cognito,
    environment,
  });
  for (const pool of pools) {
    console.log('Delete ', pool.IdentityPoolId);
    // this function isn't in the SDK!
    exec(
      `aws cognito-idp delete-user-pool-domain --domain auth-${environment.name}-flexion-efcms --region ${environment.region} --user-pool-id ${pool.IdentityPoolId}`,
    );
    await sleep(5000);
    console.log('Delete ', pool.IdentityPools);
    await cognito.deletePool({ PoolName: pool.PoolName }).promise();
    await sleep(5000);
  }

  let resourceCount = pools.length;

  while (resourceCount > 0) {
    await sleep(5000);
    const refreshedPools = await getCognitoPools({
      cognito,
      environment,
    });
    console.log(
      'Waiting for domains to be deleted: ',
      Date(),
      refreshedPools.length,
    );
    resourceCount = refreshedPools.length;
  }
};

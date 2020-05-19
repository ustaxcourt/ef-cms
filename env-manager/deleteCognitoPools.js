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
    console.log('Delete domains for Cognito Pools:', pool);
    // the delete-user-pool-domain function isn't in the SDK!
    exec(
      `aws cognito-idp delete-user-pool-domain --domain auth-${environment.name}-flexion-efcms --region ${environment.region} --user-pool-id ${pool.Id}`,
    );
    exec(
      `aws cognito-idp delete-user-pool-domain --domain auth-irs-${environment.name}-flexion-efcms --region ${environment.region} --user-pool-id ${pool.Id}`,
    );
    await sleep(5000);
    console.log('Delete Cognito Pool:', pool.Name);
    await cognito.deleteUserPool({ UserPoolId: pool.Id }).promise();
    await sleep(5000);
  }
};

const { getCloudFormation } = require('./getCloudFormation');
const { getStacks } = require('./getStacks');
const { sleep } = require('./sleep');

exports.deleteStacks = async ({ environment }) => {
  const cloudFormation = getCloudFormation({ environment });
  const stacks = await getStacks({
    cloudFormation,
    environment,
  });
  for (const stack of stacks) {
    console.log('Delete ', stack.StackName);
    await cloudFormation.deleteStack({ StackName: stack.StackName }).promise();
    await sleep(100);
  }

  let resourceCount = stacks.length;

  while (resourceCount > 0) {
    await sleep(1000);
    const refreshedStacks = await getStacks({
      cloudFormation,
      environment,
    });
    console.log(
      'Waiting for stacks to be deleted: ',
      Date(),
      refreshedStacks.length,
    );
    resourceCount = refreshedStacks.length;
  }
};

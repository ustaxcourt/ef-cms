const { getCloudFormation } = require('./getCloudFormation');
const { getStacks } = require('./getStacks');
const { sleepForMilliseconds } = require('./sleep');

exports.deleteStacks = async ({ environment }) => {
  const cloudFormation = getCloudFormation({ environment });
  const stacks = await getStacks({
    cloudFormation,
    environment,
  });
  for (const stack of stacks) {
    console.log(
      'Delete CloudFormation Stack:',
      environment.region,
      stack.StackName,
    );
    await cloudFormation.deleteStack({ StackName: stack.StackName }).promise();
  }

  let resourceCount = stacks.length;

  while (resourceCount > 0) {
    await sleepForMilliseconds(1000);
    const refreshedStacks = await getStacks({
      cloudFormation,
      environment,
    });
    console.log(
      'Remaining stacks:',
      environment.region,
      refreshedStacks.length,
    );
    resourceCount = refreshedStacks.length;
  }
};

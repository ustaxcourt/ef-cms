const { getStacks } = require('./getStacks');
const { sleep } = require('./sleep');

exports.deleteStacks = async ({ cloudFormation, environment }) => {
  const stacks = await getStacks({
    cloudFormation,
    environment,
  });
  for (const stack of stacks) {
    await cloudFormation.deleteStack({ StackName: stack.StackName }).promise();
  }

  let resourceCount = stacks.length;

  while (resourceCount > 0) {
    await sleep(2000);
    const refreshedStacks = await getStacks({
      cloudFormation,
      environment,
    });
    console.log('Waiting for stacks to be deleted: ', Date(), refreshedStacks);
    resourceCount = refreshedStacks.length;
  }
};

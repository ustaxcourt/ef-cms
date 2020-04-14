const { filter } = require('lodash');

exports.getStacks = async ({ cloudFormation, environment }) => {
  const { StackSummaries } = await cloudFormation.listStacks({}).promise();
  return filter(StackSummaries, stackSummary => {
    return stackSummary.StackName.includes(`-${environment.name}`);
  });
};

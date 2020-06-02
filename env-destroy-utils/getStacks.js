const { filter } = require('lodash');

exports.getStacks = async ({ cloudFormation, environment }) => {
  const { StackSummaries } = await cloudFormation
    .listStacks({
      StackStatusFilter: [
        'CREATE_IN_PROGRESS',
        'CREATE_FAILED',
        'CREATE_COMPLETE',
        'ROLLBACK_IN_PROGRESS',
        'ROLLBACK_FAILED',
        'ROLLBACK_COMPLETE',
        'DELETE_IN_PROGRESS',
        'DELETE_FAILED',
        'UPDATE_IN_PROGRESS',
        'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS',
        'UPDATE_COMPLETE',
        'UPDATE_ROLLBACK_IN_PROGRESS',
        'UPDATE_ROLLBACK_FAILED',
        'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS',
        'UPDATE_ROLLBACK_COMPLETE',
        'REVIEW_IN_PROGRESS',
        'IMPORT_IN_PROGRESS',
        'IMPORT_COMPLETE',
        'IMPORT_ROLLBACK_IN_PROGRESS',
        'IMPORT_ROLLBACK_FAILED',
        'IMPORT_ROLLBACK_COMPLETE',
      ],
    })
    .promise();
  return filter(StackSummaries, stackSummary => {
    return stackSummary.StackName.includes(`-${environment.name}`);
  });
};

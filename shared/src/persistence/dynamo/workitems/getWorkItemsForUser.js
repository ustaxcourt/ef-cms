const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const {
  updateWorkItemsUsingCases,
} = require('../../dynamo/helpers/updateWorkItemsUsingCases');

exports.getWorkItemsForUser = async ({ userId, applicationContext }) => {
  const workItems = await getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'workItem',
  });

  return updateWorkItemsUsingCases({ applicationContext, workItems });
};

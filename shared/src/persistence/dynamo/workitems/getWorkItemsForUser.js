const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');

exports.getWorkItemsForUser = async ({ userId, applicationContext }) => {
  const workItems = await getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'workItem',
  });

  return workItems;
};

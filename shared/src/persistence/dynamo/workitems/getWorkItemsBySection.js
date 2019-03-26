const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const {
  updateWorkItemsUsingCases,
} = require('../../dynamo/helpers/updateWorkItemsUsingCases');

exports.getWorkItemsBySection = async ({ section, applicationContext }) => {
  const workItems = await getRecordsViaMapping({
    applicationContext,
    key: section,
    type: 'workItem',
  });

  return updateWorkItemsUsingCases({ applicationContext, workItems });
};

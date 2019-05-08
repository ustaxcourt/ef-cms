const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');

exports.getWorkItemsBySection = async ({ section, applicationContext }) => {
  const workItems = await getRecordsViaMapping({
    applicationContext,
    key: section,
    type: 'workItem',
  });

  return workItems;
};

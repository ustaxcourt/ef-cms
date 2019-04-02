const {
  getSortRecordsViaMapping,
} = require('../../dynamo/helpers/getSortRecordsViaMapping');
const moment = require('moment');
const {
  updateWorkItemsUsingCases,
} = require('../../dynamo/helpers/updateWorkItemsUsingCases');

exports.getSentWorkItemsForUser = async ({ userId, applicationContext }) => {
  const workItems = await getSortRecordsViaMapping({
    afterDate: moment
      .utc(new Date().toISOString())
      .startOf('day')
      .subtract(7, 'd')
      .utc()
      .format(),
    applicationContext,
    foreignKey: 'workItemId',
    key: userId,
    type: 'outbox',
  });

  return updateWorkItemsUsingCases({ applicationContext, workItems });
};

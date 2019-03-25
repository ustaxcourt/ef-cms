const { getSortRecords } = require('../../dynamo/helpers/getSortRecords');
const moment = require('moment');
const {
  updateWorkItemsUsingCases,
} = require('../../dynamo/helpers/updateWorkItemsUsingCases');

exports.getSentWorkItemsForUser = async ({ userId, applicationContext }) => {
  const workItems = await getSortRecords({
    afterDate: moment
      .utc(new Date().toISOString())
      .startOf('day')
      .subtract(7, 'd')
      .utc()
      .format(),
    applicationContext,
    key: userId,
    type: 'outbox',
  });

  return updateWorkItemsUsingCases({ applicationContext, workItems });
};

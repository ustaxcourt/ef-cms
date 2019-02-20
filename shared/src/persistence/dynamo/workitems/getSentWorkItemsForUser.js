const { getSortRecordsViaMapping } = require('../../awsDynamoPersistence');
const moment = require('moment');

exports.getSentWorkItemsForUser = ({ userId, applicationContext }) => {
  return getSortRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'sentWorkItem',
    afterDate: moment
      .utc(new Date().toISOString())
      .startOf('day')
      .subtract(7, 'd')
      .utc()
      .format(),
    foreignKey: 'workItemId',
  });
};

const { getSortRecordsViaMapping } = require('../../awsDynamoPersistence');
const moment = require('moment');

exports.getCompletedWorkItemsForUser = ({ userId, applicationContext }) => {
  return getSortRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'completedWorkItem',
    afterDate: moment
      .utc(new Date().toISOString())
      .startOf('day')
      .subtract(7, 'd')
      .utc()
      .format(),
    foreignKey: 'workItemId',
  });
};

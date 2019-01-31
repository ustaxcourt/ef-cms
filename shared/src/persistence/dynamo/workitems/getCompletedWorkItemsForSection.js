const { getSortRecordsViaMapping } = require('../../awsDynamoPersistence');
const moment = require('moment');

exports.getCompletedWorkItemsForSection = ({ section, applicationContext }) => {
  return getSortRecordsViaMapping({
    applicationContext,
    key: section,
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

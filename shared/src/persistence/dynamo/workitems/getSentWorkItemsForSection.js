const { getSortRecordsViaMapping } = require('../../awsDynamoPersistence');
const moment = require('moment');

exports.getSentWorkItemsForSection = ({ section, applicationContext }) => {
  return getSortRecordsViaMapping({
    applicationContext,
    key: section,
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

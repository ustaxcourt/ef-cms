const {
  getSortRecordsViaMapping,
} = require('../../dynamo/helpers/getSortRecordsViaMapping');
const moment = require('moment');

exports.getSentWorkItemsForSection = ({ section, applicationContext }) => {
  return getSortRecordsViaMapping({
    afterDate: moment
      .utc(new Date().toISOString())
      .startOf('day')
      .subtract(7, 'd')
      .utc()
      .format(),
    applicationContext,
    foreignKey: 'workItemId',
    key: section,
    type: 'sentWorkItem',
  });
};

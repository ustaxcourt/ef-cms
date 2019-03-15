const { getSortRecords } = require('../../dynamo/helpers/getSortRecords');
const moment = require('moment');

exports.getSentWorkItemsForSection = ({ section, applicationContext }) => {
  return getSortRecords({
    afterDate: moment
      .utc(new Date().toISOString())
      .startOf('day')
      .subtract(7, 'd')
      .utc()
      .format(),
    applicationContext,
    key: section,
    type: 'outbox',
  });
};

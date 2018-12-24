const { getRecordsViaMapping } = require('../../awsDynamoPersistence');

exports.getWorkItemsForUser = ({ userId, applicationContext }) => {
  return getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'workItem',
  });
};

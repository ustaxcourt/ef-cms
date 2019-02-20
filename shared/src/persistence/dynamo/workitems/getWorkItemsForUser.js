const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');

exports.getWorkItemsForUser = ({ userId, applicationContext }) => {
  return getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'workItem',
  });
};

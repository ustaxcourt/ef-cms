const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');

exports.getWorkItemsBySection = ({ section, applicationContext }) => {
  return getRecordsViaMapping({
    applicationContext,
    key: section,
    type: 'workItem',
  });
};

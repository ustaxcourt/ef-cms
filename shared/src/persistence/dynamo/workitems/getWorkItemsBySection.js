const { getRecordsViaMapping } = require('../../awsDynamoPersistence');

exports.getWorkItemsBySection = ({ section, applicationContext }) => {
  return getRecordsViaMapping({
    applicationContext,
    key: section,
    type: 'workItem',
  });
};

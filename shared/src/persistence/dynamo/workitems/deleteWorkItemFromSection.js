const { deleteMappingRecord } = require('../helpers/deleteMappingRecord');

exports.deleteWorkItemFromSection = ({
  applicationContext,
  workItemId,
  section,
}) => {
  return deleteMappingRecord({
    applicationContext,
    pkId: section,
    skId: workItemId,
    type: 'workItem',
  });
};

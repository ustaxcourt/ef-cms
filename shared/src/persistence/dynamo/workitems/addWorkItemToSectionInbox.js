const { createMappingRecord } = require('../helpers/createMappingRecord');

exports.addWorkItemToSectionInbox = async ({
  workItem,
  applicationContext,
}) => {
  await createMappingRecord({
    applicationContext,
    pkId: workItem.section,
    skId: workItem.workItemId,
    type: 'workItem',
  });
};

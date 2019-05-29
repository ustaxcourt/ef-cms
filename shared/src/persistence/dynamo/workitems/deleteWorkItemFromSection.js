const { deleteSectionInboxRecord } = require('./deleteSectionInboxRecord');

exports.deleteWorkItemFromSection = ({ applicationContext, workItem }) => {
  return deleteSectionInboxRecord({
    applicationContext,
    workItem,
  });
};

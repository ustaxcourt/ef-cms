const { isDocumentRecord, upGenerator } = require('./utilities');

const mutateRecord = async item => {
  if (isDocumentRecord(item)) {
    if (item.workItems) {
      console.log('deleting work items array');
      delete item.workItems;

      return item;
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

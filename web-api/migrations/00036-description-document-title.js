const { isDocketEntryRecord, upGenerator } = require('./utilities');

const mutateRecord = async item => {
  if (isDocketEntryRecord(item) && !item.documentTitle) {
    item.documentTitle = item.description;
    delete item.description;
    return { ...item };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

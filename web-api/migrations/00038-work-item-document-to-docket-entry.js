const { cloneDeep } = require('lodash');
const { isWorkItemOrWorkQueueRecord, upGenerator } = require('./utilities');

const mutateRecord = async item => {
  if (isWorkItemOrWorkQueueRecord(item)) {
    if (!item.docketEntry && item.document) {
      item.docketEntry = cloneDeep(item.document);
      item.docketEntry.docketEntryId = item.document.documentId;
      delete item.document;

      return { ...item };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

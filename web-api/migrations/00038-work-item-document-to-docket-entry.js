const createApplicationContext = require('../src/applicationContext');
const { cloneDeep } = require('lodash');
const { isWorkItemOrWorkQueueRecord, upGenerator } = require('./utilities');
const { WorkItem } = require('../../shared/src/business/entities/WorkItem');

const applicationContext = createApplicationContext();

const mutateRecord = async item => {
  if (isWorkItemOrWorkQueueRecord(item)) {
    if (!item.docketEntry && item.document) {
      item.docketEntry = cloneDeep(item.document);
      item.docketEntry.docketEntryId = item.document.documentId;
      delete item.document;

      const updatedWorkItem = new WorkItem(item, {
        applicationContext,
      })
        .validate()
        .toRawObject();

      return { ...item, ...updatedWorkItem };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

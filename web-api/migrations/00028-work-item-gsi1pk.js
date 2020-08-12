const createApplicationContext = require('../src/applicationContext');
const { isWorkItemRecord, upGenerator } = require('./utilities');
const { WorkItem } = require('../../shared/src/business/entities/WorkItem');

const applicationContext = createApplicationContext();

const mutateRecord = async item => {
  if (isWorkItemRecord(item)) {
    if (!item.gsi1pk) {
      item.gsi1pk = `work-item|${item.workItemId}`;

      // toRawObject will remove the gsi1pk, but we can validate the object anyway
      new WorkItem(item, { applicationContext }).validate();

      return item;
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

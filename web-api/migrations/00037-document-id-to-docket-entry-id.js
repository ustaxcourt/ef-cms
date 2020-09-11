const createApplicationContext = require('../src/applicationContext');
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
const { isDocketEntryRecord, upGenerator } = require('./utilities');

const applicationContext = createApplicationContext({});

const mutateRecord = async item => {
  if (isDocketEntryRecord(item)) {
    item.docketEntryId = item.documentId;
    delete item.documentId;

    if (item.previousDocument && item.previousDocument.documentId) {
      item.previousDocument.docketEntryId = item.previousDocument.documentId;
      delete item.previousDocument.documentId;
    }

    const newDocketEntry = new DocketEntry(item, { applicationContext })
      .validate()
      .toRawObject();

    return { ...item, ...newDocketEntry };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

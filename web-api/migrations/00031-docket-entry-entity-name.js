const createApplicationContext = require('../src/applicationContext');
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
const { isDocumentRecord, upGenerator } = require('./utilities');

const applicationContext = createApplicationContext({});

const mutateRecord = async item => {
  if (isDocumentRecord(item) && item.entityName !== 'DocketEntry') {
    const newDocketEntry = new DocketEntry(
      { ...item, docketEntryId: item.docketEntryId || item.documentId },
      { applicationContext },
    )
      .validate()
      .toRawObject();

    return { ...item, ...newDocketEntry };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

const createApplicationContext = require('../src/applicationContext');
const { isDocumentRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');

const mutateRecord = async item => {
  if (isDocumentRecord(item)) {
    console.log(
      `step 13: (${item.docketNumber} ${item.documentId}) isFileAttached: ${
        typeof item.isFileAttached === 'undefined' ? 'undefined ' : 'defined'
      }`,
    );
    if (item.isFileAttached === undefined) {
      item.isFileAttached = true;
    }
    const documentToUpdate = new DocketEntry(
      { ...item, docketEntryId: item.docketEntryId || item.documentId },
      { applicationContext },
    )
      .validate()
      .toRawObject();

    return { ...item, ...documentToUpdate };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

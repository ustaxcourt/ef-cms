const createApplicationContext = require('../src/applicationContext');
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
const { isDocumentRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = async item => {
  if (isDocumentRecord(item)) {
    if (item.qcByUser) {
      if (item.qcByUser.userId) {
        item.qcByUserId = item.qcByUser.userId;
      }

      const updatedDocument = new DocketEntry(
        { ...item, docketEntryId: item.docketEntryId || item.documentId },
        { applicationContext },
      )
        .validate()
        .toRawObject();

      return { ...item, ...updatedDocument };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

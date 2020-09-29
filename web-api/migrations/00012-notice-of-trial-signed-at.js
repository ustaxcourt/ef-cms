const createApplicationContext = require('../src/applicationContext');
const { isDocumentRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');

const mutateRecord = async item => {
  if (isDocumentRecord(item)) {
    const documentRequiresSignedAt =
      !!item.servedAt && item.eventCode === 'NTD';

    if (documentRequiresSignedAt && !item.signedAt) {
      // Use createdAt for signedAt, since these are likely auto-generated documents (signed and created at the same time)
      const documentToUpdate = new DocketEntry(
        {
          ...item,
          docketEntryId: item.docketEntryId || item.documentId,
          signedAt: item.createdAt,
        },
        { applicationContext },
      )
        .validate()
        .toRawObject();

      return { ...item, ...documentToUpdate };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

const createApplicationContext = require('../src/applicationContext');
const { isDocumentRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});
const { Document } = require('../../shared/src/business/entities/Document');

const mutateRecord = async item => {
  if (isDocumentRecord(item)) {
    const documentRequiresSignedAt =
      !!item.servedAt && item.eventCode === 'NTD';

    if (documentRequiresSignedAt && !item.signedAt) {
      // Use createdAt for signedAt, since these are likely auto-generated documents (signed and created at the same time)
      const documentToUpdate = new Document(
        { ...item, signedAt: item.createdAt },
        { applicationContext },
      )
        .validate()
        .toRawObject();

      return { ...item, ...documentToUpdate };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

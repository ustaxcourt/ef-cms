const createApplicationContext = require('../src/applicationContext');
const { isDocumentRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});
const { Document } = require('../../shared/src/business/entities/Document');

const mutateRecord = async item => {
  if (isDocumentRecord(item)) {
    console.log(`step 13: (${item.docketNumber} ${item.documentId}) isFileAttached: ${typeof item.isFileAttached === 'undefined' ? 'undefined ': 'defined'}`)
    if (item.isFileAttached === undefined) {
      item.isFileAttached = true;
    }
    const documentToUpdate = new Document(item, { applicationContext })
      .validate()
      .toRawObject();

    return { ...item, ...documentToUpdate };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

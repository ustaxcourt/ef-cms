const createApplicationContext = require('../src/applicationContext');
const { Document } = require('../../shared/src/business/entities/Document');
const { isDocumentRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = async item => {
  if (isDocumentRecord(item)) {
    if (item.previousDocument) {
      const updatedDocument = new Document(item, { applicationContext })
        .validate()
        .toRawObject();

      return { ...item, ...updatedDocument };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

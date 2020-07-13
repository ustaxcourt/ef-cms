const createApplicationContext = require('../src/applicationContext');
const { isDocumentRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});
const {
  EXTERNAL_DOCUMENT_TYPES,
  INTERNAL_DOCUMENT_TYPES,
} = require('../../shared/src/business/entities/EntityConstants');
const { Document } = require('../../shared/src/business/entities/Document');

const DEFAULT_FILED_BY = 'Filed via migration.';

const mutateRecord = async item => {
  if (isDocumentRecord(item)) {
    const documentRequiresFiledBy =
      INTERNAL_DOCUMENT_TYPES.includes(item.documentType) ||
      EXTERNAL_DOCUMENT_TYPES.includes(item.documentType);

    if (documentRequiresFiledBy && !item.filedBy) {
      const documentToUpdate = new Document(
        { ...item, filedBy: DEFAULT_FILED_BY },
        { applicationContext },
      )
        .validate()
        .toRawObject();

      return { ...item, ...documentToUpdate };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

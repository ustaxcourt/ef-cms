const createApplicationContext = require('../src/applicationContext');
const { isDocumentRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
const {
  EXTERNAL_DOCUMENT_TYPES,
  INTERNAL_DOCUMENT_TYPES,
} = require('../../shared/src/business/entities/EntityConstants');

const DEFAULT_FILED_BY = 'Filed via migration.';

const mutateRecord = async item => {
  if (isDocumentRecord(item)) {
    const documentRequiresFiledBy =
      INTERNAL_DOCUMENT_TYPES.includes(item.documentType) ||
      EXTERNAL_DOCUMENT_TYPES.includes(item.documentType);

    if (documentRequiresFiledBy && !item.filedBy) {
      const documentToUpdate = new DocketEntry(
        {
          ...item,
          docketEntryId: item.docketEntryId || item.documentId,
          filedBy: DEFAULT_FILED_BY,
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

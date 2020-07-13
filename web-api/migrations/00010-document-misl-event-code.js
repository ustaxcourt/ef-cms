const createApplicationContext = require('../src/applicationContext');
const {
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  DOCUMENT_INTERNAL_CATEGORIES_MAP,
} = require('../../shared/src/business/entities/EntityConstants');
const { Document } = require('../../shared/src/business/entities/Document');
const { flatten } = require('lodash');
const { isDocumentRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = async item => {
  if (isDocumentRecord(item)) {
    if (item.eventCode === 'MISL') {
      const externalDocumentMap = flatten(
        Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
      );
      const internalDocumentMap = flatten(
        Object.values(DOCUMENT_INTERNAL_CATEGORIES_MAP),
      );

      const foundDocument =
        externalDocumentMap.find(d => d.documentType === item.documentType) ||
        internalDocumentMap.find(d => d.documentType === item.documentType);

      if (foundDocument) {
        item.eventCode = foundDocument.eventCode;
      } else {
        item.eventCode = 'MGRTED';
      }
      const documentToUpdate = new Document({ ...item }, { applicationContext })
        .validate()
        .toRawObject();

      return { ...item, ...documentToUpdate };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = item => {
  if (isCaseRecord(item)) {
    item.documents.forEach(document => {
      if (document.previousDocument) {
        const previousDocumentTitle = document.previousDocument;
        document.previousDocument = {
          documentTitle: previousDocumentTitle,
          documentType: previousDocumentTitle,
        };
      }
    });

    const caseEntity = new Case(item, { applicationContext })
      .validate()
      .toRawObject();

    const itemToPut = {
      ...item,
      ...caseEntity,
    };
    return itemToPut;
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

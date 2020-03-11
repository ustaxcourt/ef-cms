const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = item => {
  if (isCaseRecord(item)) {
    item.docketRecord.forEach(docketEntry => {
      // Case.documents[].filingDate = Case.docketRecord[].filingDate
      if (item.documents && docketEntry.documentId) {
        item.documents.forEach(document => {
          if (docketEntry.documentId === document.documentId) {
            document.filingDate = docketEntry.filingDate;
          }
        });
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

const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = item => {
  if (isCaseRecord(item)) {
    let isMutated = false;
    for (let docketEntry of item.docketRecord) {
      if (!docketEntry.eventCode) {
        isMutated = true;
        docketEntry.eventCode = 'MGRTED';
      }
      if (!docketEntry.description) {
        isMutated = true;
        docketEntry.description = 'MGRTED';
      }
      if (docketEntry.index === undefined || docketEntry.index === null) {
        isMutated = true;
        docketEntry.index = 100;
      }
    }

    const caseEntity = new Case(item, { applicationContext })
      .validate()
      .toRawObject();

    const itemToPut = {
      ...item,
      ...caseEntity,
    };
    return isMutated && itemToPut;
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

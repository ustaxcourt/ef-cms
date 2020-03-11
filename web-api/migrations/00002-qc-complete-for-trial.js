const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = item => {
  if (isCaseRecord(item) && !item.qcCompleteForTrial) {
    console.log(
      `adding qcCompleteForTrial default value to case with id "${item.caseId}"`,
    );
    item.qcCompleteForTrial = {};

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

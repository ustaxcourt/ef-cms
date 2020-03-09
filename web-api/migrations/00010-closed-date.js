const createApplicationContext = require('../src/applicationContext');
const {
  createISODateString,
} = require('../../shared/src/business/utilities/DateHandler');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = item => {
  if (
    isCaseRecord(item) &&
    item.status === Case.STATUS_TYPES.closed &&
    !item.closedDate
  ) {
    item.closedDate = createISODateString();

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

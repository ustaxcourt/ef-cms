const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = item => {
  if (
    isCaseRecord(item) &&
    ['Batched for IRS', 'Recalled'].includes(item.status)
  ) {
    console.log(
      `updating Batched/Recalled case status to new for ${item.caseId}`,
    );
    const caseEntity = new Case(
      {
        ...item,
        status: Case.STATUS_TYPES.new,
      },
      { applicationContext },
    ).toRawObject();

    return { ...item, ...caseEntity };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

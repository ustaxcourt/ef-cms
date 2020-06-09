const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = item => {
  let { statistics } = item;

  if (
    isCaseRecord(item) &&
    (item.caseType !== Case.CASE_TYPES_MAP.deficiency ||
      item.hasVerifiedIrsNotice !== true) &&
    statistics &&
    statistics.length
  ) {
    const caseEntity = new Case(
      {
        ...item,
        statistics: [],
      },
      { applicationContext },
    )
      .validate()
      .toRawObject();

    return { ...item, ...caseEntity };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

const createApplicationContext = require('../src/applicationContext');
const {
  CASE_TYPES_MAP,
} = require('../../shared/src/business/entities/EntityConstants');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const { Statistic } = require('../../shared/src/business/entities/Statistic');
const applicationContext = createApplicationContext({});

const mutateRecord = item => {
  if (
    isCaseRecord(item) &&
    item.caseType === CASE_TYPES_MAP.deficiency &&
    item.hasVerifiedIrsNotice === true
  ) {
    let { statistics } = item;
    if (!statistics || statistics.length === 0) {
      const defaultStatistic = new Statistic(
        {
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          year: '2012',
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );
      statistics = [defaultStatistic];
    } else {
      statistics.map(statistic => {
        if (statistic.deficiencyAmount) {
          statistic.irsDeficiencyAmount = statistic.deficiencyAmount;
        }
        if (statistic.totalPenalties) {
          statistic.irsTotalPenalties = statistic.totalPenalties;
        }
      });
    }

    const caseEntity = new Case(
      {
        ...item,
        statistics,
      },
      { applicationContext },
    )
      .validate()
      .toRawObject();

    return { ...item, ...caseEntity };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

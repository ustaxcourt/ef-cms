const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const { Statistic } = require('../../shared/src/business/entities/Statistic');
const applicationContext = createApplicationContext({});

const mutateRecord = item => {
  if (isCaseRecord(item)) {
    let { statistics } = item;

    if (
      item.caseType === Case.CASE_TYPES_MAP.deficiency &&
      item.hasVerifiedIrsNotice === true
    ) {
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
        statistics.forEach(statistic => {
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
    } else if (
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
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

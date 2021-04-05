const createApplicationContext = require('../../../../src/applicationContext');
const {
  createISODateAtStartOfDayEST,
} = require('../../../../../shared/src/business/utilities/DateHandler');
const {
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');

const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    // look for pks of: CaseDeadline, Correspondence, EntityValidationConstants, Message, Statistic, Case, TrialSession
    if (
      item.pk.startsWith('case-deadline|') ||
      item.pk.startsWith('correspondence|') ||
      item.pk.startsWith('message|')
    ) {
      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

const createApplicationContext = require('../../../../src/applicationContext');
const {
  CaseDeadline,
} = require('../../../../../shared/src/business/entities/CaseDeadline');
const {
  createISODateString,
  FORMATS,
  isValidDateString,
} = require('../../../../../shared/src/business/utilities/DateHandler');

const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    // look for pks of: CaseDeadline, Correspondence, EntityValidationConstants, Message, Statistic, Case, TrialSession
    if (item.pk.startsWith('case-deadline|')) {
      if (!isValidDateString(item.deadlineDate, FORMATS.ISO)) {
        item.deadlineDate = createISODateString(item.deadlineDate);
      }
      if (!isValidDateString(item.createdAt, FORMATS.ISO)) {
        item.createdAt = createISODateString(item.createdAt);
      }

      new CaseDeadline(item, { applicationContext }).validate();

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

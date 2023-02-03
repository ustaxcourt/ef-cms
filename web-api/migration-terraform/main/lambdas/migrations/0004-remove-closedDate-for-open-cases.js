const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  CLOSED_CASE_STATUSES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  UserCase,
} = require('../../../../../shared/src/business/entities/UserCase');

const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

const isUserCaseRecord = item => {
  return item.pk.startsWith('user|') && item.sk.startsWith('case|');
};

const applicationContext = createApplicationContext({});

const migrateItems = items => {
  const itemsAfter = [];

  for (const item of items) {
    if (isCaseRecord(item)) {
      if (item.closedDate && !CLOSED_CASE_STATUSES.includes(item.status)) {
        delete item.closedDate;

        new Case(item, {
          applicationContext,
        }).validateWithLogging(applicationContext);
      }
    } else if (isUserCaseRecord(item)) {
      if (item.closedDate && !CLOSED_CASE_STATUSES.includes(item.status)) {
        delete item.closedDate;

        new UserCase(item, {
          applicationContext,
        }).validateWithLogging(applicationContext);
      }
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

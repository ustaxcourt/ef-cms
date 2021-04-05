/* eslint-disable complexity */
const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  CaseDeadline,
} = require('../../../../../shared/src/business/entities/CaseDeadline');
const {
  Correspondence,
} = require('../../../../../shared/src/business/entities/Correspondence');
const {
  createISODateAtStartOfDayEST,
  FORMATS,
  isValidDateString,
} = require('../../../../../shared/src/business/utilities/DateHandler');
const {
  Message,
} = require('../../../../../shared/src/business/entities/Message');
const {
  TrialSession,
} = require('../../../../../shared/src/business/entities/trialSessions/TrialSession');

const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    // look for pks of: EntityValidationConstants, Statistic, Case, TrialSession
    if (item.pk.startsWith('case-deadline|')) {
      if (
        item.deadlineDate &&
        !isValidDateString(item.deadlineDate, FORMATS.ISO)
      ) {
        item.deadlineDate = createISODateAtStartOfDayEST(item.deadlineDate);
      }

      if (item.createdAt && !isValidDateString(item.createdAt, FORMATS.ISO)) {
        item.createdAt = createISODateAtStartOfDayEST(item.createdAt);
      }

      new CaseDeadline(item, { applicationContext }).validate();

      itemsAfter.push(item);
    } else if (item.sk.startsWith('correspondence|')) {
      if (item.filingDate && !isValidDateString(item.filingDate, FORMATS.ISO)) {
        item.filingDate = createISODateAtStartOfDayEST(item.filingDate);
      }

      new Correspondence(item, { applicationContext }).validate();

      itemsAfter.push(item);
    } else if (item.sk.startsWith('message|')) {
      if (item.createdAt && !isValidDateString(item.createdAt, FORMATS.ISO)) {
        item.createdAt = createISODateAtStartOfDayEST(item.createdAt);
      }
      if (
        item.completedAt &&
        !isValidDateString(item.completedAt, FORMATS.ISO)
      ) {
        item.completedAt = createISODateAtStartOfDayEST(item.completedAt);
      }

      new Message(item, { applicationContext }).validate();

      itemsAfter.push(item);
    } else if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      if (item.statistics && item.statistics.length > 0) {
        item.statistics.forEach(statistic => {
          if (
            statistic.lastDateOfPeriod &&
            !isValidDateString(statistic.lastDateOfPeriod, FORMATS.ISO)
          ) {
            statistic.lastDateOfPeriod = createISODateAtStartOfDayEST(
              statistic.lastDateOfPeriod,
            );
          }
        });
      }

      new Case(item, { applicationContext }).validate();

      itemsAfter.push(item);
    } else if (
      item.pk.startsWith('trial-session|') &&
      item.sk.startsWith('trial-session|')
    ) {
      if (item.createdAt && !isValidDateString(item.createdAt, FORMATS.ISO)) {
        item.createdAt = createISODateAtStartOfDayEST(item.createdAt);
      }
      if (
        item.noticeIssuedDate &&
        !isValidDateString(item.noticeIssuedDate, FORMATS.ISO)
      ) {
        item.noticeIssuedDate = createISODateAtStartOfDayEST(
          item.noticeIssuedDate,
        );
      }
      new TrialSession(item, { applicationContext }).validate();

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

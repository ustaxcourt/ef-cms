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
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');
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

      if (item.createdAt && !isValidDateString(item.createdAt, FORMATS.ISO)) {
        item.createdAt = createISODateAtStartOfDayEST(item.createdAt);
      }
      if (item.receivedAt && !isValidDateString(item.receivedAt, FORMATS.ISO)) {
        item.receivedAt = createISODateAtStartOfDayEST(item.receivedAt);
      }
      if (
        item.noticeOfTrialDate &&
        !isValidDateString(item.noticeOfTrialDate, FORMATS.ISO)
      ) {
        item.noticeOfTrialDate = createISODateAtStartOfDayEST(
          item.noticeOfTrialDate,
        );
      }
      if (
        item.automaticBlockedDate &&
        !isValidDateString(item.automaticBlockedDate, FORMATS.ISO)
      ) {
        item.automaticBlockedDate = createISODateAtStartOfDayEST(
          item.automaticBlockedDate,
        );
      }
      if (
        item.blockedDate &&
        !isValidDateString(item.blockedDate, FORMATS.ISO)
      ) {
        item.blockedDate = createISODateAtStartOfDayEST(item.blockedDate);
      }
      if (item.closedDate && !isValidDateString(item.closedDate, FORMATS.ISO)) {
        item.closedDate = createISODateAtStartOfDayEST(item.closedDate);
      }
      if (
        item.irsNoticeDate &&
        !isValidDateString(item.irsNoticeDate, FORMATS.ISO)
      ) {
        item.irsNoticeDate = createISODateAtStartOfDayEST(item.irsNoticeDate);
      }
      if (
        item.petitionPaymentDate &&
        !isValidDateString(item.petitionPaymentDate, FORMATS.ISO)
      ) {
        item.petitionPaymentDate = createISODateAtStartOfDayEST(
          item.petitionPaymentDate,
        );
      }
      if (
        item.petitionPaymentWaivedDate &&
        !isValidDateString(item.petitionPaymentWaivedDate, FORMATS.ISO)
      ) {
        item.petitionPaymentWaivedDate = createISODateAtStartOfDayEST(
          item.petitionPaymentWaivedDate,
        );
      }
      if (item.sealedDate && !isValidDateString(item.sealedDate, FORMATS.ISO)) {
        item.sealedDate = createISODateAtStartOfDayEST(item.sealedDate);
      }
      if (item.trialDate && !isValidDateString(item.trialDate, FORMATS.ISO)) {
        item.trialDate = createISODateAtStartOfDayEST(item.trialDate);
      }

      new Case(item, { applicationContext }).validate();

      itemsAfter.push(item);
    } else if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('docket-entry|')
    ) {
      if (
        item.certificateOfServiceDate &&
        !isValidDateString(item.certificateOfServiceDate, FORMATS.ISO)
      ) {
        item.certificateOfServiceDate = createISODateAtStartOfDayEST(
          item.certificateOfServiceDate,
        );
      }
      if (item.createdAt && !isValidDateString(item.createdAt, FORMATS.ISO)) {
        item.createdAt = createISODateAtStartOfDayEST(item.createdAt);
      }
      if (item.date && !isValidDateString(item.date, FORMATS.ISO)) {
        item.date = createISODateAtStartOfDayEST(item.date);
      }
      if (item.filingDate && !isValidDateString(item.filingDate, FORMATS.ISO)) {
        item.filingDate = createISODateAtStartOfDayEST(item.filingDate);
      }
      if (item.qcAt && !isValidDateString(item.qcAt, FORMATS.ISO)) {
        item.qcAt = createISODateAtStartOfDayEST(item.qcAt);
      }
      if (item.receivedAt && !isValidDateString(item.receivedAt, FORMATS.ISO)) {
        item.receivedAt = createISODateAtStartOfDayEST(item.receivedAt);
      }
      if (
        item.serviceDate &&
        !isValidDateString(item.serviceDate, FORMATS.ISO)
      ) {
        item.serviceDate = createISODateAtStartOfDayEST(item.serviceDate);
      }
      if (item.strickenAt && !isValidDateString(item.strickenAt, FORMATS.ISO)) {
        item.strickenAt = createISODateAtStartOfDayEST(item.strickenAt);
      }

      new DocketEntry(item, { applicationContext }).validate();

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
      if (item.startDate && !isValidDateString(item.startDate, FORMATS.ISO)) {
        item.startDate = createISODateAtStartOfDayEST(item.startDate);
      }
      if (
        item.removedFromTrialDate &&
        !isValidDateString(item.removedFromTrialDate, FORMATS.ISO)
      ) {
        item.removedFromTrialDate = createISODateAtStartOfDayEST(
          item.removedFromTrialDate,
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

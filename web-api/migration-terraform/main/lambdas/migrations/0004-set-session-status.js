const createApplicationContext = require('../../../../src/applicationContext');
const {
  SESSION_STATUS_GROUPS,
  TRIAL_SESSION_SCOPE_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  TrialSession,
} = require('../../../../../shared/src/business/entities/trialSessions/TrialSession');
const { isEmpty, isEqual } = require('lodash');

const isTrialSession = item => {
  return (
    item.pk.startsWith('trial-session|') && item.sk.startsWith('trial-session|')
  );
};
const applicationContext = createApplicationContext({});

const getTrialSessionStatus = session => {
  const allCases = session.caseOrder || [];
  const inactiveCases = allCases.filter(
    sessionCase => sessionCase.removedFromTrial === true,
  );

  if (
    session.isClosed ||
    (!isEmpty(allCases) &&
      isEqual(allCases, inactiveCases) &&
      session.sessionScope !== TRIAL_SESSION_SCOPE_TYPES.standaloneRemote)
  ) {
    return SESSION_STATUS_GROUPS.closed;
  } else if (session.isCalendared) {
    return SESSION_STATUS_GROUPS.open;
  } else {
    return SESSION_STATUS_GROUPS.new;
  }
};

const migrateItems = items => {
  const itemsAfter = [];

  for (const item of items) {
    if (isTrialSession(item)) {
      item.sessionStatus = getTrialSessionStatus(item);

      delete item.isClosed;

      new TrialSession(item, { applicationContext }).validateWithLogging(
        applicationContext,
      );
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

const createApplicationContext = require('../../../../src/applicationContext');
const {
  getTrialSessionStatus,
} = require('../../../../../shared/src/business/dto/TrialSessionInfoDto');
const {
  TrialSession,
} = require('../../../../../shared/src/business/entities/trialSessions/TrialSession');

const isTrialSession = item => {
  return (
    item.pk.startsWith('trial-session|') && item.sk.startsWith('trial-session|')
  );
};
const applicationContext = createApplicationContext({});

const migrateItems = items => {
  const itemsAfter = [];

  for (const item of items) {
    if (isTrialSession(item)) {
      item.sessionStatus = getTrialSessionStatus({
        applicationContext,
        session: item,
      });
      new TrialSession(item, { applicationContext }).validateWithLogging(
        applicationContext,
      );
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

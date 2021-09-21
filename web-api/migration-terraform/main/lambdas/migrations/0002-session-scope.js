const createApplicationContext = require('../../../../src/applicationContext');
const applicationContext = createApplicationContext({});
const {
  TRIAL_SESSION_SCOPE_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  TrialSession,
} = require('../../../../../shared/src/business/entities/trialSessions/TrialSession');

const migrateItems = items => {
  const itemsAfter = [];

  for (const item of items) {
    if (
      item.pk.startsWith('trial-session|') &&
      item.sk.startsWith('trial-session|') &&
      !item.sessionScope
    ) {
      item.sessionScope = TRIAL_SESSION_SCOPE_TYPES.locationBased;

      applicationContext.logger.info('Adding session scope to trial session', {
        pk: item.pk,
        sk: item.sk,
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

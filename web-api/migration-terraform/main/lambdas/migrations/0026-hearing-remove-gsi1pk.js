const createApplicationContext = require('../../../../src/applicationContext');
const {
  TrialSession,
} = require('../../../../../shared/src/business/entities/trialSessions/TrialSession');

const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('hearing|') &&
      item.gsi1pk &&
      item.gsi1pk === 'trial-session-catalog'
    ) {
      delete item.gsi1pk;

      new TrialSession(item, { applicationContext }).validate();

      applicationContext.logger.info(
        'Updating hearing mapping record to remove gsi1pk',
        {
          pk: item.pk,
          sk: item.sk,
        },
      );

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

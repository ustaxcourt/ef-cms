const createApplicationContext = require('../../../../src/applicationContext');
const {
  DEFAULT_PROCEEDING_TYPE,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  TrialSession,
} = require('../../../../../shared/src/business/entities/trialSessions/TrialSession');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('trial-session|') &&
      item.sk.startsWith('trial-session|')
    ) {
      if (!item.proceedingType) {
        console.log('adding a proceeding type');
        const trialSessionEntity = new TrialSession(
          {
            ...item,
            proceedingType: DEFAULT_PROCEEDING_TYPE,
          },
          {
            applicationContext,
          },
        );

        itemsAfter.push({
          ...item,
          ...trialSessionEntity.validate().toRawObject(),
        });
        console.log('pushed an updated item', {
          ...item,
          ...trialSessionEntity.validate().toRawObject(),
        });
      } else {
        itemsAfter.push(item);
      }
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

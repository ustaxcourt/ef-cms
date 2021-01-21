const createApplicationContext = require('../../../../src/applicationContext');
const {
  TrialSession,
} = require('../../../../../shared/src/business/entities/trialSessions/TrialSession');
const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('hearing|') &&
      !item.proceedingType
    ) {
      const trialSessionRecord = await documentClient
        .get({
          Key: {
            pk: `trial-session|${item.trialSessionId}`,
            sk: `trial-session|${item.trialSessionId}`,
          },
          TableName: process.env.SOURCE_TABLE,
        })
        .promise()
        .then(res => {
          return res.Item;
        });

      if (!trialSessionRecord) {
        throw new Error(
          `Trial session with id ${item.trialSessionId} not found`,
        );
      }

      const trialSessionEntity = new TrialSession(
        { ...item, proceedingType: trialSessionRecord.proceedingType },
        {
          applicationContext,
        },
      );

      itemsAfter.push({
        ...item,
        ...trialSessionEntity.validate().toRawObject(),
      });

      const docketNumber = item.pk.split('|')[1];
      applicationContext.logger.info(
        `migrating hearing for case ${docketNumber} and trial session id ${item.trialSessionId}`,
        {
          ...item,
          ...trialSessionEntity.validate().toRawObject(),
        },
      );
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

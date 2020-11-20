const createApplicationContext = require('../../../../src/applicationContext');
const {
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');
const {
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.includes('case|') && item.sk.includes('docket-entry|')) {
      if (
        item.eventCode ===
        SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.eventCode
      ) {
        if (!item.signedAt || !item.signedJudgeName || !item.signedByUserId) {
          const caseRecord = await documentClient
            .get({
              Key: {
                pk: `case|${item.docketNumber}`,
                sk: `case|${item.docketNumber}`,
              },
              TableName: process.env.SOURCE_TABLE,
            })
            .promise()
            .then(res => {
              return res.Item;
            });

          if (!caseRecord.trialSessionId) {
            throw new Error(
              `Case record ${item.docketNumber} has not been added to a trial session.`,
            );
          }

          const trialSession = await documentClient
            .get({
              Key: {
                pk: `trial-session|${caseRecord.trialSessionId}`,
                sk: `trial-session|${caseRecord.trialSessionId}`,
              },
              TableName: process.env.SOURCE_TABLE,
            })
            .promise()
            .then(res => {
              return res.Item;
            });

          item.signedAt = applicationContext
            .getUtilities()
            .createISODateString();
          item.signedJudgeName = trialSession.judge.name;
          item.signedByUserId = trialSession.judge.userId;

          const updatedDocketEntry = new DocketEntry(item, {
            applicationContext,
          })
            .validate()
            .toRawObject();

          itemsAfter.push({
            ...item,
            ...updatedDocketEntry,
          });
        } else {
          itemsAfter.push(item);
        }
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

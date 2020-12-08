const createApplicationContext = require('../../../../src/applicationContext');
const {
  CaseDeadline,
} = require('../../../../../shared/src/business/entities/CaseDeadline');
const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.includes('case-deadline|') &&
      item.sk.includes('case-deadline|')
    ) {
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

      if (caseRecord.associatedJudge !== item.associatedJudge) {
        item.associatedJudge = caseRecord.associatedJudge;
      }

      const updatedDeadlineRaw = new CaseDeadline(item, {
        applicationContext,
      })
        .validate()
        .toRawObject();

      itemsAfter.push({
        ...item,
        ...updatedDeadlineRaw,
      });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

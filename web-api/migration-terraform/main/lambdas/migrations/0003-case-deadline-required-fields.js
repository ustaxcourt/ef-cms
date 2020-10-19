const createApplicationContext = require('../../../../src/applicationContext');
const {
  CaseDeadline,
} = require('../../../../../shared/src/business/entities/CaseDeadline');
const {
  CHIEF_JUDGE,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.includes('case-deadline|') &&
      item.sk.includes('case-deadline|')
    ) {
      if (!item.associatedJudge) {
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

        if (caseRecord && caseRecord.associatedJudge) {
          item.associatedJudge = caseRecord.associatedJudge;
        } else {
          item.associatedJudge = CHIEF_JUDGE;
        }
      }

      // generate sortableDocketNumber in the constructor
      const updatedDeadline = new CaseDeadline(item, { applicationContext })
        .validate()
        .toRawObject();

      itemsAfter.push({
        ...item,
        ...updatedDeadline,
      });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

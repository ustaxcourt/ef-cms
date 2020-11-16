const createApplicationContext = require('../../../../src/applicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  UserCase,
} = require('../../../../../shared/src/business/entities/UserCase');

const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.includes('user|') &&
      item.sk.includes('case|') &&
      item.gsi1pk.includes('user-case|')
    ) {
      if (!item.closedDate && item.status === CASE_STATUS_TYPES.closed) {
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

        if (caseRecord && caseRecord.docketNumber) {
          item.closedDate = caseRecord.closedDate;
        } else {
          throw new Error(`Case record ${item.docketNumber} was not found`);
        }
      }

      const updatedUserCase = new UserCase(item, { applicationContext })
        .validate()
        .toRawObject();

      itemsAfter.push({
        ...item,
        ...updatedUserCase,
      });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

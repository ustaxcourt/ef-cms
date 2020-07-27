const createApplicationContext = require('../src/applicationContext');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});
const { Case } = require('../../shared/src/business/entities/cases/Case');

const mutateRecord = async (item, documentClient, tableName) => {
  if (isCaseRecord(item) && item.leadCaseId && !item.leadDocketNumber) {
    const caseRecord = await documentClient
      .get({
        Key: {
          pk: `case|${item.leadCaseId}`,
          sk: `case|${item.leadCaseId}`,
        },
        TableName: tableName,
      })
      .promise();

    if (caseRecord && caseRecord.Item) {
      const leadDocketNumber = caseRecord.Item.docketNumber;

      if (leadDocketNumber) {
        const caseToUpdate = new Case(
          { ...item, leadDocketNumber },
          {
            applicationContext,
          },
        )
          .validate()
          .toRawObject();

        return { ...item, ...caseToUpdate };
      }
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

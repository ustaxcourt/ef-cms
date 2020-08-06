const createApplicationContext = require('../src/applicationContext');
const { isCaseDeadlineRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});
const {
  CaseDeadline,
} = require('../../shared/src/business/entities/CaseDeadline');

const mutateRecord = async (item, documentClient, tableName) => {
  if (isCaseDeadlineRecord(item)) {
    if (item.caseId && !item.docketNumber) {
      const caseRecord = await documentClient
        .get({
          Key: {
            pk: `case|${item.caseId}`,
            sk: `case|${item.caseId}`,
          },
          TableName: tableName,
        })
        .promise();

      if (caseRecord && caseRecord.Item) {
        item.docketNumber = caseRecord.Item.docketNumber;

        const caseDeadlineToUpdate = new CaseDeadline(item, {
          applicationContext,
        })
          .validate()
          .toRawObject();

        return { ...item, ...caseDeadlineToUpdate };
      }
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

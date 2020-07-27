const createApplicationContext = require('../src/applicationContext');
const {
  isCaseRecord,
  isUserCaseMappingRecord,
  upGenerator,
} = require('./utilities');
const applicationContext = createApplicationContext({});
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { UserCase } = require('../../shared/src/business/entities/UserCase');

const mutateRecord = async (item, documentClient, tableName) => {
  if (
    (isCaseRecord(item) || isUserCaseMappingRecord(item)) &&
    item.leadCaseId &&
    !item.leadDocketNumber
  ) {
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
        let itemToUpdate;
        if (isCaseRecord(item)) {
          itemToUpdate = new Case(
            { ...item, leadDocketNumber },
            {
              applicationContext,
            },
          )
            .validate()
            .toRawObject();
        } else {
          itemToUpdate = new UserCase(
            { ...item, leadDocketNumber },
            {
              applicationContext,
            },
          )
            .validate()
            .toRawObject();
        }

        return { ...item, ...itemToUpdate };
      }
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

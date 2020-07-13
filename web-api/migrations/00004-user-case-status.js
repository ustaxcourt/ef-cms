const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isUserCaseMappingRecord, upGenerator } = require('./utilities');
const { UserCase } = require('../../shared/src/business/entities/UserCase');
const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  if (isUserCaseMappingRecord(item) && !item.status) {
    const caseId = item.sk.split('|')[1];
    const mappedCase = await documentClient
      .get({
        Key: {
          pk: `case|${caseId}`,
          sk: `case|${caseId}`,
        },
        TableName: tableName,
      })
      .promise();

    if (mappedCase.Item) {
      const caseEntity = new Case(mappedCase.Item, { applicationContext });
      const userCaseEntity = new UserCase(caseEntity.validate().toRawObject(), {
        applicationContext,
      })
        .validate()
        .toRawObject();

      return {
        ...item,
        ...userCaseEntity,
      };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

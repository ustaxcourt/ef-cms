const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isUserCaseMappingRecord, upGenerator } = require('./utilities');
const { UserCase } = require('../../shared/src/business/entities/UserCase');
const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  const caseId = item.sk.split('|')[1];
  const shouldMigrate = item =>
    !item.gsi1pk || !item.gsi1pk.startsWith('user-case|'); // indicates `user-case|` on gsi1pk

  if (isUserCaseMappingRecord(item) && shouldMigrate(item)) {
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
        gsi1pk: `user-case|${caseId}`,
      };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

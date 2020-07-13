const createApplicationContext = require('../src/applicationContext');
const {
  isNewUserCaseMappingRecord,
  isUserCaseMappingRecord,
  upGenerator,
} = require('./utilities');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { UserCase } = require('../../shared/src/business/entities/UserCase');
const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  const caseId = item.sk.split('|')[1];

  if (isUserCaseMappingRecord(item) && !isNewUserCaseMappingRecord(item)) {
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
        entityName: 'UserCase',
        gsi1pk: `user-case|${caseId}`,
      };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

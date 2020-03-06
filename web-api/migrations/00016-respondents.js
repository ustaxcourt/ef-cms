const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  if (isCaseRecord(item)) {
    const caseEntity = new Case(item, { applicationContext });

    for (const respondent of caseEntity.respondents) {
      await documentClient
        .put({
          Item: {
            ...respondent,
            pk: `case|${item.caseId}`,
            sk: `respondent|${respondent.userId}`,
          },
          TableName: tableName,
        })
        .promise();
    }

    delete caseEntity.respondents;

    console.log(`removing respondents[] from case ${item.caseId}`);

    return { ...item, ...caseEntity.toRawObject() };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  if (isCaseRecord(item)) {
    const caseEntity = new Case(item, { applicationContext });

    for (const practitioner of caseEntity.practitioners) {
      await documentClient
        .put({
          Item: {
            ...practitioner,
            pk: `case|${item.caseId}`,
            sk: `practitioner|${practitioner.userId}`,
          },
          TableName: tableName,
        })
        .promise();
    }

    delete caseEntity.practitioners;

    console.log(`removing practitioners[] from case ${item.caseId}`);

    return { ...item, ...caseEntity.toRawObject() };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

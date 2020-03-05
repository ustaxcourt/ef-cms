const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  if (isCaseRecord(item)) {
    const caseEntity = new Case(item, { applicationContext });

    for (const document of caseEntity.documents) {
      await documentClient
        .put({
          Item: {
            ...document,
            pk: `case|${item.caseId}`,
            sk: `document|${document.documentId}`,
          },
          TableName: tableName,
        })
        .promise();
    }

    delete caseEntity.documents;

    console.log(`removing documents[] from case ${item.caseId}`);

    return { ...item, ...caseEntity.toRawObject(false) };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

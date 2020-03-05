const createApplicationContext = require('../src/applicationContext');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  if (isCaseRecord(item)) {
    const caseEntity = new Case(item, { applicationContext });

    for (const record of caseEntity.docketRecord) {
      const docketRecordId = applicationContext.getUniqueId();
      console.log(`adding docket-record ${docketRecordId}`);
      await documentClient
        .put({
          Item: {
            ...record,
            docketRecordId,
            pk: `case|${item.caseId}`,
            sk: `docket-record|${docketRecordId}`,
          },
          TableName: tableName,
        })
        .promise();
    }

    console.log(`removing docketRecord[] from case ${item.caseId}`);
    delete caseEntity.docketRecord;

    return { ...item, ...caseEntity.toRawObject() };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

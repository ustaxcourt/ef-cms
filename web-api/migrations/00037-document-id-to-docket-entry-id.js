const createApplicationContext = require('../src/applicationContext');
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
const { isDocketEntryRecord, upGenerator } = require('./utilities');

const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  if (isDocketEntryRecord(item)) {
    if (!item.docketEntryId) {
      item.docketEntryId = item.documentId;
      delete item.documentId;
    }

    if (item.previousDocument && !item.previousDocument.docketEntryId) {
      item.previousDocument.docketEntryId = item.previousDocument.documentId;
      delete item.previousDocument.documentId;
    }

    if (!item.sk.includes(item.docketEntryId)) {
      await documentClient
        .delete({
          Key: {
            pk: item.pk,
            sk: item.sk,
          },
          TableName: tableName,
        })
        .promise();
      item.sk = `docket-entry|${item.docketEntryId}`;
    }

    console.log('modifying docket entry', item.docketEntryId);

    const newDocketEntry = new DocketEntry(item, { applicationContext })
      .validate()
      .toRawObject();

    return { ...item, ...newDocketEntry };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

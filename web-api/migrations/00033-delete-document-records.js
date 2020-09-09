const { isDocumentRecord, upGenerator } = require('./utilities');

// Migration 00032-document-docket-entry-sk created new docket-entry| records from document|
// records but did not remove the old document| records. This cleans that up.

const mutateRecord = async (item, documentClient, tableName) => {
  if (isDocumentRecord(item)) {
    const documentId = item.pk.split('|')[1];

    console.log('deleting document', documentId);
    await documentClient
      .delete({
        Key: {
          pk: item.pk,
          sk: item.sk,
        },
        TableName: tableName,
      })
      .promise();
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

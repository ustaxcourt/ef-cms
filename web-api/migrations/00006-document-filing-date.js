const { isCaseRecord } = require('./utilities');

const up = async (documentClient, tableName, forAllRecords) => {
  await forAllRecords(documentClient, tableName, async item => {
    if (!isCaseRecord(item)) return;

    if (item.docketRecord) {
      item.docketRecord.forEach(docketEntry => {
        // Case.documents[].filingDate = Case.docketRecord[].filingDate
        if (item.documents && docketEntry.documentId) {
          item.documents.forEach(document => {
            if (docketEntry.documentId === document.documentId) {
              document.filingDate = docketEntry.filingDate;
            }
          });
        }
      });

      await documentClient
        .put({
          Item: item,
          TableName: tableName,
        })
        .promise();
    }
  });
};

module.exports = { up };

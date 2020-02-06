const isCaseRecord = item => !!item.caseType;
const { forAllRecords } = require('./00004-service-indicator');

const up = async (documentClient, tableName) => {
  await forAllRecords(documentClient, tableName, async item => {
    if (!isCaseRecord(item)) return;

    if (item.documents) {
      item.documents.forEach(document => {
        if (document.previousDocument) {
          const previousDocumentTitle = document.previousDocument;
          document.previousDocument = {
            documentTitle: previousDocumentTitle,
            documentType: previousDocumentTitle,
          };
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

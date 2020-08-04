const createApplicationContext = require('../src/applicationContext');
const {
  COURT_ISSUED_DOCUMENT_TYPES,
  ORDER_TYPES,
} = require('../../shared/src/business/entities/EntityConstants');
const { Document } = require('../../shared/src/business/entities/Document');
const { isDocumentRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const orderDocumentTypes = ORDER_TYPES.map(orderType => orderType.documentType);

const getIsDraftForDocument = async ({
  document,
  documentClient,
  tableName,
}) => {
  const caseRecord = await documentClient
    .get({
      Key: {
        pk: `case|${document.docketNumber}`,
        sk: `case|${document.docketNumber}`,
      },
      TableName: tableName,
    })
    .promise();

  if (caseRecord && caseRecord.Item) {
    const caseData = caseRecord.Item;
    const isNotArchived = !document.archived;
    const isNotServed = !document.servedAt;
    const isDocumentOnDocketRecord = caseData.docketRecord.find(
      docketEntry => docketEntry.documentId === document.documentId,
    );
    const isStipDecision = document.documentType === 'Stipulated Decision';
    const isDraftOrder = orderDocumentTypes.includes(document.documentType);
    const isCourtIssuedDocument = COURT_ISSUED_DOCUMENT_TYPES.includes(
      document.documentType,
    );
    return (
      isNotArchived &&
      isNotServed &&
      (isStipDecision ||
        (isDraftOrder && !isDocumentOnDocketRecord) ||
        (isCourtIssuedDocument && !isDocumentOnDocketRecord))
    );
  }
};

const mutateRecord = async (item, documentClient, tableName) => {
  if (isDocumentRecord(item)) {
    let isUpdated = false;

    // this is being added in this migration because it was missed in earlier migrations,
    // and we have invalid old data
    if (item.isDraft === undefined) {
      item.isDraft = await getIsDraftForDocument({
        document: item,
        documentClient,
        tableName,
      });

      isUpdated = true;
    }

    if (item.workItems && item.workItems[0]) {
      item.workItem = item.workItems[0];
      const otherWorkItems = item.workItems.splice(1);

      for (const workItemToDelete of otherWorkItems) {
        await documentClient.delete({
          Key: {
            pk: `work-item|${workItemToDelete.workItemId}`,
            sk: `work-item|${workItemToDelete.workItemId}`,
          },
          TableName: tableName,
        });
      }

      isUpdated = true;
    }

    if (isUpdated) {
      const updatedDocument = new Document(item, { applicationContext })
        .validate()
        .toRawObject();

      return { ...item, ...updatedDocument };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

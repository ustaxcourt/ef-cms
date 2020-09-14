const createApplicationContext = require('../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  COURT_ISSUED_DOCUMENT_TYPES,
  EVENT_CODES_REQUIRING_JUDGE_SIGNATURE,
  ORDER_TYPES,
} = require('../../shared/src/business/entities/EntityConstants');
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
const { isDocumentRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const orderDocumentTypes = ORDER_TYPES.map(orderType => orderType.documentType);

const getIsDraftForDocument = async ({
  document,
  documentClient,
  tableName,
}) => {
  const caseRecords = await documentClient
    .query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${document.docketNumber}`,
      },
      KeyConditionExpression: '#pk = :pk',
      TableName: tableName,
    })
    .promise();

  if (!caseRecords || !caseRecords.Items) {
    return false;
  }

  const fullCaseRecord = aggregateCaseItems(caseRecords.Items);

  if (fullCaseRecord) {
    const isNotArchived = !document.archived;
    const isNotServed = !document.servedAt;
    const isDocumentOnDocketRecord = document.isOnDocketRecord;
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

    if (
      item.isDraft === false &&
      EVENT_CODES_REQUIRING_JUDGE_SIGNATURE.includes(item.eventCode)
    ) {
      if (item.signedAt === undefined) {
        item.signedAt = '2020-07-06T17:06:04.552Z';
      }
      if (item.signedJudgeName === undefined) {
        item.signedJudgeName = 'Chief Judge';
      }
      if (item.signedByUserId === undefined) {
        item.signedByUserId = '7b69a8b5-bcc4-4449-8994-08fda8d342e7';
      }

      isUpdated = true;
    }

    if (item.workItems && item.workItems[0]) {
      item.workItem = item.workItems[0];
      const otherWorkItems = item.workItems.splice(1);

      for (const workItemToDelete of otherWorkItems) {
        await documentClient
          .delete({
            Key: {
              pk: `work-item|${workItemToDelete.workItemId}`,
              sk: `work-item|${workItemToDelete.workItemId}`,
            },
            TableName: tableName,
          })
          .promise();
      }

      isUpdated = true;
    }

    if (isUpdated) {
      const updatedDocument = new DocketEntry(
        { ...item, docketEntryId: item.docketEntryId || item.documentId },
        { applicationContext },
      )
        .validate()
        .toRawObject();

      return { ...item, ...updatedDocument };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

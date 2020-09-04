const createApplicationContext = require('../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  ALL_DOCUMENT_TYPES_MAP,
} = require('../../shared/src/business/entities/EntityConstants');
const { Document } = require('../../shared/src/business/entities/Document');
const { isCaseRecord, upGenerator } = require('./utilities');

const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  if (isCaseRecord(item)) {
    const caseRecords = await documentClient
      .query({
        ExpressionAttributeNames: {
          '#pk': 'pk',
        },
        ExpressionAttributeValues: {
          ':pk': `case|${item.docketNumber}`,
        },
        KeyConditionExpression: '#pk = :pk',
        TableName: tableName,
      })
      .promise();

    if (!caseRecords || !caseRecords.Items) {
      return false;
    }

    const fullCaseRecord = aggregateCaseItems(caseRecords.Items);

    await Promise.all(
      fullCaseRecord.documents.map(document => {
        const docketEntry = fullCaseRecord.docketRecord.find(
          d => d.documentId === document.documentId,
        );

        if (docketEntry) {
          const updatedDocument = new Document(
            {
              ...document,
              ...docketEntry,
              isOnDocketRecord: true,
            },
            { applicationContext },
          )
            .validate()
            .toRawObject();

          documentClient
            .put({
              Item: {
                ...updatedDocument,
                pk: `case|${item.docketNumber}`,
                sk: `document|${document.documentId}`,
              },
              TableName: tableName,
            })
            .promise();
        }
      }),
    );

    await Promise.all(
      fullCaseRecord.docketRecord.map(docketEntry => {
        const caseDocument = fullCaseRecord.documents.find(
          d => d.documentId === docketEntry.documentId,
        );

        if (!caseDocument) {
          const { documentType } = ALL_DOCUMENT_TYPES_MAP.find(
            m => m.eventCode === docketEntry.eventCode,
          );

          const newDocument = new Document(
            {
              ...docketEntry,
              docketNumber: item.docketNumber,
              documentTitle: docketEntry.description,
              documentType,
              filedBy: 'Migrated',
              isFileAttached: false,
              isMinuteEntry: true,
              isOnDocketRecord: true,
              processingStatus: 'complete',
              signedAt: '2020-07-06T17:06:04.552Z',
              signedByUserId: '7b69a8b5-bcc4-4449-8994-08fda8d342e7',
              signedJudgeName: 'Chief Judge',
              userId: item.userId,
            },
            { applicationContext },
          )
            .validate()
            .toRawObject();

          documentClient
            .put({
              Item: {
                ...newDocument,
                pk: `case|${item.docketNumber}`,
                sk: `document|${docketEntry.documentId}`,
              },
              TableName: tableName,
            })
            .promise();
        }

        documentClient
          .delete({
            Key: {
              pk: docketEntry.pk,
              sk: docketEntry.sk,
            },
            TableName: tableName,
          })
          .promise();
      }),
    );
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

const createApplicationContext = require('../src/applicationContext');
const {
  ALL_DOCUMENT_TYPES_MAP,
} = require('../../shared/src/business/entities/EntityConstants');
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
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

    const documents = caseRecords.Items.filter(
      item => item.sk.startsWith('document|') && !item.archived,
    );
    const docketRecord = caseRecords.Items.filter(item =>
      item.sk.startsWith('docket-record|'),
    );

    await Promise.all(
      (documents || []).map(document => {
        const docketEntry = (docketRecord || []).find(
          d =>
            d.documentId === document.documentId ||
            d.documentId === document.docketEntryId,
        );

        if (docketEntry) {
          const updatedDocument = new DocketEntry(
            {
              ...document,
              ...docketEntry,
              docketEntryId: document.docketEntryId || document.documentId,
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
                sk: `document|${document.docketEntryId || document.documentId}`,
              },
              TableName: tableName,
            })
            .promise();
        }
      }),
    );

    await Promise.all(
      (docketRecord || []).map(docketEntry => {
        const caseDocument = documents.find(
          d =>
            d.documentId === docketEntry.documentId ||
            d.docketEntryId === docketEntry.documentId,
        );

        if (!caseDocument) {
          const { documentType } = ALL_DOCUMENT_TYPES_MAP.find(
            m => m.eventCode === docketEntry.eventCode,
          );

          const newDocument = new DocketEntry(
            {
              ...docketEntry,
              docketEntryId: docketEntry.documentId,
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

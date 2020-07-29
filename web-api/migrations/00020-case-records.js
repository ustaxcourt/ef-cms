const { upGenerator } = require('./utilities');

const updateCaseRecords = async ({
  caseId,
  docketNumber,
  documentClient,
  tableName,
}) => {
  const caseRecords = await documentClient
    .query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${caseId}`,
      },
      KeyConditionExpression: '#pk = :pk',
      TableName: tableName,
    })
    .promise();

  for (const caseRecord of caseRecords.Items) {
    caseRecord.pk = caseRecord.pk.replace(caseId, docketNumber);
    caseRecord.sk = caseRecord.sk.replace(caseId, docketNumber);

    await documentClient
      .put({
        Item: caseRecord,
        TableName: tableName,
      })
      .promise();
  }
};

const updateUserCaseRecords = async ({
  caseId,
  docketNumber,
  documentClient,
  tableName,
}) => {
  const userCaseRecords = await documentClient
    .query({
      ExpressionAttributeNames: {
        '#gsi1pk': 'gsi1pk',
      },
      ExpressionAttributeValues: {
        ':gsi1pk': `user-case|${caseId}`,
      },
      IndexName: 'gsi1',
      KeyConditionExpression: '#gsi1pk = :gsi1pk',
      TableName: tableName,
    })
    .promise();

  for (const userCaseRecord of userCaseRecords.Items) {
    userCaseRecord.gsi1pk = userCaseRecord.gsi1pk.replace(caseId, docketNumber);
    userCaseRecord.sk = userCaseRecord.sk.replace(caseId, docketNumber);

    await documentClient
      .put({
        Item: userCaseRecord,
        TableName: tableName,
      })
      .promise();
  }
};

const updateCaseCatalogRecord = async ({
  caseId,
  docketNumber,
  documentClient,
  tableName,
}) => {
  const caseCatalogRecord = await documentClient
    .get({
      Key: {
        pk: 'catalog',
        sk: `case|${caseId}`,
      },
      TableName: tableName,
    })
    .promise();

  if (caseCatalogRecord && caseCatalogRecord.Item) {
    caseCatalogRecord.Item.sk = caseCatalogRecord.Item.sk.replace(
      caseId,
      docketNumber,
    );
    caseCatalogRecord.Item.docketNumber = docketNumber;

    await documentClient
      .put({
        Item: caseCatalogRecord.Item,
        TableName: tableName,
      })
      .promise();
  }
};

const mutateRecord = async (item, documentClient, tableName) => {
  if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
    const { caseId, docketNumber } = item;

    if (caseId && docketNumber) {
      console.log('Migrating case with docket number', docketNumber);
      await updateCaseRecords({
        caseId,
        docketNumber,
        documentClient,
        tableName,
      });
      await updateUserCaseRecords({
        caseId,
        docketNumber,
        documentClient,
        tableName,
      });
      await updateCaseCatalogRecord({
        caseId,
        docketNumber,
        documentClient,
        tableName,
      });
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };

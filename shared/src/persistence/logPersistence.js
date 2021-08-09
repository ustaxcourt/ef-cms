const client = require('./dynamodbClientService');

exports.logDocumentSearch = async (applicationContext, search) => {
  await client.put({
    Item: {
      ...search,
      ...{
        gsi1pk: 'document-search-log',
        pk: `logs|${search.timestamp}`,
        sk: `logs|${search.userId}`,
      },
    },
    applicationContext,
  });
};

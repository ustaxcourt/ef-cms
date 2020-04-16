const AWS = require('aws-sdk');

exports.indexRecord = async ({ applicationContext, fullRecord, record }) => {
  const searchClient = applicationContext.getSearchClient();

  await searchClient.index({
    body: { ...AWS.DynamoDB.Converter.marshall(fullRecord) },
    id: `${record.recordPk}_${record.recordSk}`,
    index: 'efcms',
  });
};

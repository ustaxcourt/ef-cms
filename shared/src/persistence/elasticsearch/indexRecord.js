const AWS = require('aws-sdk');

exports.indexRecord = async ({
  applicationContext,
  fullRecord,
  isAlreadyMarshalled = false,
  record,
}) => {
  const searchClient = applicationContext.getSearchClient();

  const body = isAlreadyMarshalled
    ? fullRecord
    : { ...AWS.DynamoDB.Converter.marshall(fullRecord) };

  await searchClient.index({
    body,
    id: `${record.recordPk}_${record.recordSk}`,
    index: 'efcms',
  });
};

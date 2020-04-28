const AWS = require('aws-sdk');
const { getIndexNameForRecord } = require('./getIndexNameForRecord');

exports.indexRecord = async ({
  applicationContext,
  fullRecord,
  isAlreadyMarshalled = false,
  record,
}) => {
  const searchClient = applicationContext.getSearchClient();
  const index = getIndexNameForRecord(fullRecord);

  if (index) {
    const body = isAlreadyMarshalled
      ? fullRecord
      : { ...AWS.DynamoDB.Converter.marshall(fullRecord) };

    await searchClient.index({
      body,
      id: `${record.recordPk}_${record.recordSk}`,
      index,
    });
  }
};

const client = require('../../dynamodbClientService');

exports.updateDocketRecord = async ({
  applicationContext,
  docketNumber,
  docketRecord,
  docketRecordId,
}) => {
  await client.put({
    Item: {
      pk: `case|${docketNumber}`,
      sk: `docket-record|${docketRecordId}`,
      ...docketRecord,
    },
    applicationContext,
  });
};

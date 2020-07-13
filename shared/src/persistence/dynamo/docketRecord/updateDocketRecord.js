const client = require('../../dynamodbClientService');

exports.updateDocketRecord = async ({
  applicationContext,
  caseId,
  docketRecord,
  docketRecordId,
}) => {
  await client.put({
    Item: {
      pk: `case|${caseId}`,
      sk: `docket-record|${docketRecordId}`,
      ...docketRecord,
    },
    applicationContext,
  });
};

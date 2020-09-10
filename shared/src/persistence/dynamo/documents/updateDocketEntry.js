const client = require('../../dynamodbClientService');

exports.updateDocketEntry = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
  document,
}) => {
  await client.put({
    Item: {
      pk: `case|${docketNumber}`,
      sk: `docket-entry|${docketEntryId}`,
      ...document,
    },
    applicationContext,
  });
};

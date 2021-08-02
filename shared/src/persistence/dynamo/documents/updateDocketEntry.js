const client = require('../../dynamodbClientService');
const { omit } = require('lodash');

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
      ...omit(document, 'workItem'),
    },
    applicationContext,
  });
};

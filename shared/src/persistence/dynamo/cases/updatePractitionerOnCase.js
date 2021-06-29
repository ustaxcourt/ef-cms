const client = require('../../dynamodbClientService');

exports.updateIrsPractitionerOnCase = async ({
  applicationContext,
  docketNumber,
  practitioner,
  userId,
}) =>
  client.put({
    Item: {
      ...practitioner,
      pk: `case|${docketNumber}`,
      sk: `irsPractitioner|${userId}`,
    },
    applicationContext,
  });

exports.updatePrivatePractitionerOnCase = async ({
  applicationContext,
  docketNumber,
  practitioner,
  userId,
}) =>
  client.put({
    Item: {
      ...practitioner,
      pk: `case|${docketNumber}`,
      sk: `privatePractitioner|${userId}`,
    },
    applicationContext,
  });

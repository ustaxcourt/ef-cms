const client = require('../../dynamodbClientService');

exports.updateIrsPractitionerOnCase = async ({
  applicationContext,
  docketNumber,
  practitioner,
  userId,
}) =>
  client.put({
    Item: {
      pk: `case|${docketNumber}`,
      sk: `irsPractitioner|${userId}`,
      ...practitioner,
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
      pk: `case|${docketNumber}`,
      sk: `privatePractitioner|${userId}`,
      ...practitioner,
    },
    applicationContext,
  });

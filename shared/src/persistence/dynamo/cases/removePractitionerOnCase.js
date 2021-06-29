const client = require('../../dynamodbClientService');

exports.removeIrsPractitionerOnCase = async ({
  applicationContext,
  docketNumber,
  userId,
}) =>
  client.delete({
    applicationContext,
    key: {
      pk: `case|${docketNumber}`,
      sk: `irsPractitioner|${userId}`,
    },
  });

exports.removePrivatePractitionerOnCase = async ({
  applicationContext,
  docketNumber,
  userId,
}) =>
  client.delete({
    applicationContext,
    key: {
      pk: `case|${docketNumber}`,
      sk: `privatePractitioner|${userId}`,
    },
  });

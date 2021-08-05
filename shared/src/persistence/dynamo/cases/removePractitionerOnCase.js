const client = require('../../dynamodbClientService');

exports.removeIrsPractitionerOnCase = ({
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

exports.removePrivatePractitionerOnCase = ({
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

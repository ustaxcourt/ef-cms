const client = require('../../dynamodbClientService');

exports.updateIrsPractitionerOnCase = ({
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

exports.updatePrivatePractitionerOnCase = ({
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

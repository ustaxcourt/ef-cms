const { put } = require('../../dynamodbClientService');

exports.updateCaseHearing = ({
  applicationContext,
  docketNumber,
  hearingToUpdate,
}) =>
  put({
    Item: {
      ...hearingToUpdate,
      pk: `case|${docketNumber}`,
      sk: `hearing|${hearingToUpdate.trialSessionId}`,
    },
    applicationContext,
  });

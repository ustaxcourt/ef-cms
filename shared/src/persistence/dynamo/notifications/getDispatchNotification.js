const { get } = require('../../dynamodbClientService');

exports.getDispatchNotification = ({ applicationContext, channel }) =>
  get({
    Key: {
      pk: 'dispatch-notification',
      sk: channel,
    },
    applicationContext,
  });

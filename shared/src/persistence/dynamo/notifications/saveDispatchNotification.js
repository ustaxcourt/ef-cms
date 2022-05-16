const { put } = require('../../dynamodbClientService');

const TIME_TO_EXIST = 60;

exports.saveDispatchNotification = ({ applicationContext, channel }) =>
  put({
    Item: {
      pk: 'dispatch-notification',
      sk: channel,
      ttl: Math.floor(Date.now() / 1000) + TIME_TO_EXIST,
    },
    applicationContext,
  });

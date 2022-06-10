const { put } = require('../../dynamodbClientService');

const TIME_TO_EXIST = 300; // seconds

exports.saveDispatchNotification = ({ applicationContext, topic }) =>
  put({
    Item: {
      pk: 'dispatch-notification',
      sk: topic,
      ttl: Math.floor(Date.now() / 1000) + TIME_TO_EXIST,
    },
    applicationContext,
  });

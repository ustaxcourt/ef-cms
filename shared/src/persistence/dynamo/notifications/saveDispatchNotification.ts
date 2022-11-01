import { put } from '../../dynamodbClientService';

const TIME_TO_EXIST = 300; // seconds

export const saveDispatchNotification = ({
  applicationContext,
  topic,
}: {
  applicationContext: IApplicationContext;
  topic: string;
}) =>
  put({
    Item: {
      pk: 'dispatch-notification',
      sk: topic,
      ttl: Math.floor(Date.now() / 1000) + TIME_TO_EXIST,
    },
    applicationContext,
  });

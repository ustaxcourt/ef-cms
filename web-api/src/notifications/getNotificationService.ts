import { NodeHttpHandler } from '@smithy/node-http-handler';
import { type PublishResponse } from 'aws-sdk/clients/sns';
import { SNSClient } from '@aws-sdk/client-sns';
import { environment } from '@web-api/environment';

let notificationServiceCache: SNSClient;

export const getNotificationService = () => {
  if (notificationServiceCache) {
    return notificationServiceCache;
  }

  if (environment.stage === 'local') {
    notificationServiceCache = {
      send: () => {
        return new Promise<PublishResponse>(resolve => {
          resolve({ MessageId: '' });
        });
      },
    } as unknown as SNSClient;
  } else {
    notificationServiceCache = new SNSClient({
      maxAttempts: 3,
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 3000,
        requestTimeout: 5000,
      }),
    });
  }
  return notificationServiceCache;
};

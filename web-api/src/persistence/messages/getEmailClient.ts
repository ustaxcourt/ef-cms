import { EmailResponse } from './sendEmailToUser';
import { SESClient } from '@aws-sdk/client-ses';

let sesCache: SESClient;

export function getEmailClient() {
  if (process.env.CI || process.env.DISABLE_EMAILS === 'true') {
    return {
      send: () => {
        return new Promise<EmailResponse>(resolve => {
          resolve({ MessageId: '' });
        });
      },
    } as unknown as SESClient;
  } else {
    if (!sesCache) {
      sesCache = new SESClient({
        maxAttempts: 3,
        region: 'us-east-1',
      });
    }
    return sesCache;
  }
}

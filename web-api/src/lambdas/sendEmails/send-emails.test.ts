jest.mock('@web-api/applicationContext', () => ({
  createApplicationContext: () => ({
    environment: { workerQueueUrl: 'mock' },
    logger: {
      info: jest.fn(),
      error: jest.fn(),
    },
    getMessagingClient: jest.fn().mockResolvedValue({ send: jest.fn() }),
  }),
}));
jest.mock('@web-api/dispatchers/ses/sendBulkTemplatedEmail', () => ({
  sendWithRetry: jest.fn(),
}));

import { handler as sendEmailsHandler } from './send-emails';
import { sendWithRetry as sendWithRetryMock } from '@web-api/dispatchers/ses/sendBulkTemplatedEmail';

const sendWithRetry = jest.mocked(sendWithRetryMock);

const event = {
  Records: [
    {
      body: JSON.stringify({ to: 'a@b.c' }),
      receiptHandle: 'receipt-1',
    },
  ],
};

describe('send-emails handler', () => {
  const ORIGINAL_READ_ONLY_MODE = process.env.READ_ONLY_MODE;
  const ORIGINAL_REGION = process.env.REGION;
  const ORIGINAL_ACCOUNT = process.env.AWS_ACCOUNT_ID;
  const ORIGINAL_STAGE = process.env.STAGE;
  const ORIGINAL_COLOR = process.env.CURRENT_COLOR;

  beforeEach(() => {
    process.env.REGION = 'us-east-1';
    process.env.AWS_ACCOUNT_ID = '123';
    process.env.STAGE = 'test';
    process.env.CURRENT_COLOR = 'blue';
  });

  afterEach(() => {
    process.env.READ_ONLY_MODE = ORIGINAL_READ_ONLY_MODE;
    process.env.REGION = ORIGINAL_REGION;
    process.env.AWS_ACCOUNT_ID = ORIGINAL_ACCOUNT;
    process.env.STAGE = ORIGINAL_STAGE;
    process.env.CURRENT_COLOR = ORIGINAL_COLOR;
  });

  it('throws "System is in read-only mode." when read-only mode is engaged so SQS retries the message', async () => {
    process.env.READ_ONLY_MODE = 'true';

    await expect(sendEmailsHandler(event)).rejects.toThrow(
      'System is in read-only mode.',
    );
    expect(sendWithRetry).not.toHaveBeenCalled();
  });

  it('processes the email event when not in read-only mode', async () => {
    process.env.READ_ONLY_MODE = 'false';

    await sendEmailsHandler(event);

    expect(sendWithRetry).toHaveBeenCalled();
  });
});

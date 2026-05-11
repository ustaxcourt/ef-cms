const mockGenerateNoticesInteractor = jest.fn();

jest.mock('@web-api/applicationContext', () => ({
  applicationContext: {
    logger: {
      info: jest.fn(),
      error: jest.fn(),
    },
    getUseCases: () => ({
      generateNoticesForCaseTrialSessionCalendarInteractor:
        mockGenerateNoticesInteractor,
    }),
    getMessagingClient: jest.fn().mockResolvedValue({ send: jest.fn() }),
  },
}));

import { handler as trialSessionHandler } from './trial-session';

const event = {
  Records: [
    {
      body: JSON.stringify({
        docketNumber: '101-20',
        jobId: 'job-1',
        trialSession: { trialSessionId: 't-1' },
        userId: 'u-1',
      }),
      receiptHandle: 'receipt-1',
    },
  ],
};

describe('trial-session handler', () => {
  const ORIGINAL_READ_ONLY_MODE = process.env.READ_ONLY_MODE;
  const ORIGINAL_REGION = process.env.REGION;
  const ORIGINAL_ACCOUNT = process.env.AWS_ACCOUNT_ID;
  const ORIGINAL_STAGE = process.env.STAGE;
  const ORIGINAL_COLOR = process.env.CURRENT_COLOR;

  beforeEach(() => {
    mockGenerateNoticesInteractor.mockResolvedValue(undefined);
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

    await expect(trialSessionHandler(event)).rejects.toThrow(
      'System is in read-only mode.',
    );
    expect(mockGenerateNoticesInteractor).not.toHaveBeenCalled();
  });

  it('generates notices when not in read-only mode', async () => {
    process.env.READ_ONLY_MODE = 'false';

    await trialSessionHandler(event);

    expect(mockGenerateNoticesInteractor).toHaveBeenCalled();
  });
});

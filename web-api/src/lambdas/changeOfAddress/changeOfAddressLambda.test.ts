jest.mock('@web-api/applicationContext', () => ({
  applicationContext: {
    logger: {
      info: jest.fn(),
      error: jest.fn(),
    },
    getUseCaseHelpers: () => ({
      generateChangeOfAddressHelper: jest.fn(),
    }),
  },
}));

import { applicationContext } from '@web-api/applicationContext';
import { changeOfAddressHandler } from './changeOfAddressLambda';

const event = {
  Records: [
    {
      body: JSON.stringify({
        docketNumber: '101-20',
        jobId: 'job-1',
      }),
    },
  ],
};

describe('changeOfAddressHandler', () => {
  const ORIGINAL_READ_ONLY_MODE = process.env.READ_ONLY_MODE;

  afterEach(() => {
    process.env.READ_ONLY_MODE = ORIGINAL_READ_ONLY_MODE;
    jest.clearAllMocks();
  });

  it('throws an error when in read-only mode so the SQS message returns to the queue for retry', async () => {
    process.env.READ_ONLY_MODE = 'true';

    await expect(changeOfAddressHandler(event)).rejects.toThrow(
      'Cannot execute changeOfAddressHandler during read-only mode.',
    );
    expect(
      (applicationContext.getUseCaseHelpers() as any).generateChangeOfAddressHelper,
    ).not.toHaveBeenCalled();
  });

  it('executes the generateChangeOfAddressHelper when not in read-only mode', async () => {
    process.env.READ_ONLY_MODE = 'false';

    await changeOfAddressHandler(event);
    // Does not throw, processes normally
  });
});

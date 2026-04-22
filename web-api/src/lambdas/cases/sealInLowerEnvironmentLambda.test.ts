jest.mock('@web-api/dispatchers/sqs/rescheduleLambda', () => ({
  rescheduleLambda: jest.fn(),
}));
jest.mock('@web-api/business/useCaseHelper/sealInLowerEnvironment', () => ({
  sealInLowerEnvironment: jest.fn(),
}));

import { rescheduleLambda as rescheduleLambdaMock } from '@web-api/dispatchers/sqs/rescheduleLambda';
import { sealInLowerEnvironment as sealInLowerEnvironmentMock } from '@web-api/business/useCaseHelper/sealInLowerEnvironment';
import { sealInLowerEnvironmentLambda } from './sealInLowerEnvironmentLambda';

const rescheduleLambda = jest.mocked(rescheduleLambdaMock);
const sealInLowerEnvironment = jest.mocked(sealInLowerEnvironmentMock);

const event = {
  Records: [
    {
      Sns: {
        Message: JSON.stringify({ docketNumber: '101-20' }),
      },
    },
  ],
};

describe('sealInLowerEnvironmentLambda', () => {
  const ORIGINAL_READ_ONLY_MODE = process.env.READ_ONLY_MODE;

  afterEach(() => {
    process.env.READ_ONLY_MODE = ORIGINAL_READ_ONLY_MODE;
  });

  it('executes the seal helper when not in read-only mode', async () => {
    process.env.READ_ONLY_MODE = 'false';

    await sealInLowerEnvironmentLambda(event);

    expect(sealInLowerEnvironment).toHaveBeenCalled();
    expect(rescheduleLambda).not.toHaveBeenCalled();
  });

  it('reschedules itself with a 180-second delay and does not execute the helper when in read-only mode', async () => {
    process.env.READ_ONLY_MODE = 'true';

    await sealInLowerEnvironmentLambda(event);

    expect(rescheduleLambda).toHaveBeenCalledWith(
      expect.anything(),
      { event },
      180,
    );
    expect(sealInLowerEnvironment).not.toHaveBeenCalled();
  });
});

jest.mock('@web-api/persistence/postgres/featureFlag/getMaintenanceMode');
jest.mock('@web-api/dispatchers/sqs/rescheduleLambda', () => ({
  rescheduleLambda: jest.fn(),
}));
jest.mock(
  '@web-api/business/useCases/email/handleBounceNotificationInteractor',
  () => ({
    handleBounceNotificationInteractor: jest.fn(),
  }),
);

import { handleBounceNotificationInteractor as handleBounceNotificationInteractorMock } from '@web-api/business/useCases/email/handleBounceNotificationInteractor';
import { handleBounceNotificationsLambda } from './handleBounceNotificationsLambda';
import { rescheduleLambda as rescheduleLambdaMock } from '@web-api/dispatchers/sqs/rescheduleLambda';

const rescheduleLambda = jest.mocked(rescheduleLambdaMock);
const handleBounceNotificationInteractor = jest.mocked(
  handleBounceNotificationInteractorMock,
);

const event = {
  Records: [
    {
      Sns: {
        Message: JSON.stringify({ notificationType: 'Bounce' }),
      },
    },
  ],
};

describe('handleBounceNotificationsLambda', () => {
  const ORIGINAL_READ_ONLY_MODE = process.env.READ_ONLY_MODE;

  afterEach(() => {
    process.env.READ_ONLY_MODE = ORIGINAL_READ_ONLY_MODE;
  });

  it('executes the bounce notification interactor when not in read-only mode', async () => {
    process.env.READ_ONLY_MODE = 'false';

    await handleBounceNotificationsLambda(event);

    expect(handleBounceNotificationInteractor).toHaveBeenCalled();
    expect(rescheduleLambda).not.toHaveBeenCalled();
  });

  it('reschedules itself with a 180-second delay and does not execute the interactor when in read-only mode', async () => {
    process.env.READ_ONLY_MODE = 'true';

    await handleBounceNotificationsLambda(event);

    expect(rescheduleLambda).toHaveBeenCalledWith(
      expect.anything(),
      { event },
      180,
    );
    expect(handleBounceNotificationInteractor).not.toHaveBeenCalled();
  });
});

jest.mock('@web-api/persistence/postgres/featureFlag/getMaintenanceMode');
jest.mock(
  '@web-api/business/useCases/maintenance/sendReadOnlyNotificationsInteractor',
  () => ({
    sendReadOnlyNotificationsInteractor: jest.fn(),
  }),
);

import { sendReadOnlyNotificationsInteractor as sendReadOnlyNotificationsInteractorMock } from '@web-api/business/useCases/maintenance/sendReadOnlyNotificationsInteractor';
import { sendReadOnlyNotificationsLambda } from './sendReadOnlyNotificationsLambda';

const sendReadOnlyNotificationsInteractor = jest.mocked(
  sendReadOnlyNotificationsInteractorMock,
);

describe('sendReadOnlyNotificationsLambda', () => {
  beforeEach(() => {
    sendReadOnlyNotificationsInteractor.mockResolvedValue(undefined);
  });

  it('forwards the event readOnlyMode payload to the interactor', async () => {
    await sendReadOnlyNotificationsLambda({ readOnlyMode: true });

    expect(sendReadOnlyNotificationsInteractor).toHaveBeenCalledWith(
      expect.anything(),
      { readOnlyMode: true },
    );
  });

  it('forwards readOnlyMode=false to the interactor', async () => {
    await sendReadOnlyNotificationsLambda({ readOnlyMode: false });

    expect(sendReadOnlyNotificationsInteractor).toHaveBeenCalledWith(
      expect.anything(),
      { readOnlyMode: false },
    );
  });

  it('bypasses the maintenance mode check so that notifications can be sent before/after maintenance windows', async () => {
    // When bypassMaintenanceCheck is not honored, genericHandler would throw
    // because getMaintenanceMode is mocked and resolves to { current: true }.
    const { getMaintenanceMode } = jest.requireMock(
      '@web-api/persistence/postgres/featureFlag/getMaintenanceMode',
    );
    getMaintenanceMode.mockResolvedValue({ current: true });

    await expect(
      sendReadOnlyNotificationsLambda({ readOnlyMode: true }),
    ).resolves.not.toThrow();

    expect(sendReadOnlyNotificationsInteractor).toHaveBeenCalled();
  });
});

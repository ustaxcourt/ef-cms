import { getSesStatus } from './getSesStatus';

describe('getSesStatus', () => {
  it('should pass when no rejects have occurred', async () => {
    const applicationContext: any = {
      getEmailClient: () => ({
        getSendStatistics: () => ({
          promise: () =>
            Promise.resolve({
              SendDataPoints: [
                {
                  Rejects: 0,
                },
              ],
            }),
        }),
      }),
    };

    const status = await getSesStatus({
      applicationContext,
    });

    expect(status).toBeTruthy();
  });

  it('should fail when a reject has occurred', async () => {
    const applicationContext: any = {
      getEmailClient: () => ({
        getSendStatistics: () => ({
          promise: () =>
            Promise.resolve({
              SendDataPoints: [
                {
                  Rejects: 1,
                },
              ],
            }),
        }),
      }),
    };

    const status = await getSesStatus({
      applicationContext,
    });

    expect(status).toBeFalsy();
  });
});

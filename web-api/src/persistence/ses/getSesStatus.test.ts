import { getSesStatus } from './getSesStatus';

describe('getSesStatus', () => {
  it('should pass the email client successfully gets send statistics', async () => {
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
      logger: { error: () => true, info: () => true },
    };

    const status = await getSesStatus({
      applicationContext,
    });
    expect(status).toEqual(true);
  });

  it('should fail when the email client fails to get send statistics', async () => {
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
      logger: { error: () => true, info: () => true },
    };

    const status = await getSesStatus({
      applicationContext,
    });

    expect(status).toEqual(false);
  });
});

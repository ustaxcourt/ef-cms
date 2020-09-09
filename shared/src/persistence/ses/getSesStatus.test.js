const { getSesStatus } = require('./getSesStatus');

describe('getSesStatus', () => {
  it('should pass if no bounces, complains, or rejects', async () => {
    const applicationContext = {
      getEmailClient: () => ({
        getSendStatistics: () => ({
          promise: () =>
            Promise.resolve({
              SendDataPoints: [
                {
                  Bounces: 0,
                  Complaints: 0,
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

  it('should fail if a bounce, complains, or rejects', async () => {
    const applicationContext = {
      getEmailClient: () => ({
        getSendStatistics: () => ({
          promise: () =>
            Promise.resolve({
              SendDataPoints: [
                {
                  Bounces: 1,
                  Complaints: 0,
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

    expect(status).toBeFalsy();
  });
});

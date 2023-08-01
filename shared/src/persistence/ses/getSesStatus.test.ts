jest.mock('node-cache');
import { getSesStatus } from './getSesStatus';
import NodeCache from 'node-cache';

describe('getSesStatus', () => {
  beforeAll(() => {
    (NodeCache.prototype.get as jest.Mock).mockReturnValue(undefined);
  });
  it('should pass when no rejects have occurred and no cache is available', async () => {
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

  it('should fail when a reject has occurred and no cache is available', async () => {
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

  it('should use cached status when available', async () => {
    (NodeCache.prototype.get as jest.Mock).mockReturnValueOnce(true);
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

    expect(status).toEqual(true);
  });
});

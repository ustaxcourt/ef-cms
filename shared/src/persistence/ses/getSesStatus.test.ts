import { getSesStatus } from './getSesStatus';
import NodeCache from 'node-cache';

// const mockNodeCache = new NodeCache();
jest.mock('node-cache');
// mockNodeCache.get.mockReturnValue(true);

describe('getSesStatus', () => {
  beforeEach(() => {
    NodeCache.get = jest.fn().mockReturnValue(undefined);
  });
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
      logger: { error: () => true, info: () => true },
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
      logger: { error: () => true, info: () => true },
    };

    const status = await getSesStatus({
      applicationContext,
    });

    expect(status).toBeFalsy();
  });
});

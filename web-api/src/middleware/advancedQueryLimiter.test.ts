import { advancedQueryLimiter } from './advancedQueryLimiter';
import { applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

describe('advancedQueryLimiter', () => {
  let statusMock;
  let jsonMock;
  let res;
  const MAX_INVOCATIONS = 5;

  beforeEach(() => {
    applicationContext.getPersistenceGateway().getLimiterByKey.mockReturnValue({
      maxInvocations: MAX_INVOCATIONS,
      windowTime: 1000,
    });

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({
      json: jsonMock,
    }));
    res = {
      set: jest.fn(() => ({
        status: statusMock,
      })),
      status: statusMock,
    };
  });

  it('should return a 429 response when the total requests have exceeded the maxInvocations setup in the limiter configurations', async () => {
    const next = jest.fn();
    applicationContext
      .getPersistenceGateway()
      .incrementKeyCount.mockReturnValue({
        expiresAt: Date.now() + 1e6,
        id: 20,
      });
    await advancedQueryLimiter({
      applicationContext,
      key: 'advanced-document-search',
    })(null, res, next);
    expect(statusMock).toHaveBeenCalledWith(429);
    expect(next).not.toHaveBeenCalled();
    expect(jsonMock.mock.calls[0][0]).toMatchObject({
      message: 'you are only allowed 5 requests in a 1 second window time',
      type: 'advanced-query-limiter',
    });
  });

  it('should call next if limit is not reached', async () => {
    const next = jest.fn();
    applicationContext
      .getPersistenceGateway()
      .incrementKeyCount.mockReturnValue({
        expiresAt: Date.now() + 1e6,
        id: 0,
      });
    await advancedQueryLimiter({
      applicationContext,
      key: 'advanced-document-search',
    })(null, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should reset the limiter counter if the current time is greater than expiresAt', async () => {
    const next = jest.fn();
    applicationContext
      .getPersistenceGateway()
      .incrementKeyCount.mockReturnValue({
        expiresAt: Date.now() - 1e6,
        id: 30,
      });
    await advancedQueryLimiter({
      applicationContext,
      key: 'advanced-document-search',
    })(null, res, next);
    expect(
      applicationContext.getPersistenceGateway().deleteKeyCount,
    ).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it(`should be able to be invoked exactly ${MAX_INVOCATIONS} times before reaching next if limit is not reached`, async () => {
    const next = jest.fn();
    let count = 0;
    applicationContext
      .getPersistenceGateway()
      .incrementKeyCount.mockImplementation(() => {
        return {
          expiresAt: Date.now() + 1e6,
          id: ++count,
        };
      });

    for (let i = 0; i < 5; i++) {
      await advancedQueryLimiter({
        applicationContext,
        key: 'advanced-document-search',
      })(
        {
          applicationContext,
        },
        res,
        next,
      );
    }

    await advancedQueryLimiter({
      applicationContext,
      key: 'advanced-document-search',
    })(null, res, next);

    expect(next).toHaveBeenCalledTimes(MAX_INVOCATIONS);
    // the 6th call should have failed and not invoked next
    expect(next.mock.calls[MAX_INVOCATIONS]).toBeUndefined();
    expect(statusMock.mock.calls[0]).toBeDefined();
  });
});

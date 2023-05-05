import { applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { ipLimiter } from './ipLimiter';

describe('ipLimiter', () => {
  let statusMock;
  let jsonMock;
  let res;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({
      json: jsonMock,
    }));
    res = {
      set: jest.fn(() => ({
        status: statusMock,
      })),
    };
  });

  it('should return a 429 response', async () => {
    const next = jest.fn();
    applicationContext
      .getPersistenceGateway()
      .incrementKeyCount.mockReturnValue({
        expiresAt: Date.now() + 1e6,
        id: 20,
      });
    await ipLimiter({ applicationContext, key: 'order-search' })(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
      },
      res,
      next,
    );
    expect(statusMock).toHaveBeenCalledWith(429);
    expect(next).not.toHaveBeenCalled();
    expect(jsonMock.mock.calls[0][0]).toMatchObject({
      message: 'you are only allowed 15 requests in a 60 second window time',
      type: 'ip-limiter',
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
    await ipLimiter({ applicationContext, key: 'order-search' })(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
      },
      res,
      next,
    );
    expect(next).toHaveBeenCalled();
  });

  it('should delete the limiter key if expires at is passed', async () => {
    const next = jest.fn();
    applicationContext
      .getPersistenceGateway()
      .incrementKeyCount.mockReturnValue({
        expiresAt: Date.now() - 1e6,
        id: 30,
      });
    await ipLimiter({ applicationContext, key: 'order-search' })(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
      },
      res,
      next,
    );
    expect(
      applicationContext.getPersistenceGateway().deleteKeyCount,
    ).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should be able to be invoked exactly 15 times before locking next if limit is not reached', async () => {
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

    for (let i = 0; i < 15; i++) {
      await ipLimiter({ applicationContext, key: 'order-search' })(
        {
          apiGateway: {
            event: {
              requestContext: {
                identity: '127.0.0.1',
              },
            },
          },
        },
        res,
        next,
      );
    }

    await ipLimiter({ applicationContext, key: 'order-search' })(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
        applicationContext,
      },
      res,
      next,
    );

    expect(next).toHaveBeenCalledTimes(15);
    // the 16th call should have failed and not invoked next
    expect(next.mock.calls[15]).toBeUndefined();
    expect(statusMock.mock.calls[0]).toBeDefined();
  });
});

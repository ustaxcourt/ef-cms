const { advancedQueryLimiter } = require('./advancedQueryLimiter');

let mockPersistenceGateway = {};

jest.mock('../applicationContext', () => () => ({
  getPersistenceGateway: () => mockPersistenceGateway,
}));

describe('advancedQueryLimiter', () => {
  let incrementKeyCountMock = jest.fn();
  const deleteKeyCountMock = jest.fn();
  const getLimiterByKeyMock = jest.fn().mockReturnValue({
    maxInvocations: 5,
    windowTime: 1000,
  });
  const applicationContextMock = {
    getPersistenceGateway: () => ({
      deleteKeyCount: jest.fn(),
      getLimiterByKey: getLimiterByKeyMock,
      incrementKeyCount: incrementKeyCountMock,
      setExpiresAt: jest.fn(),
    }),
  };

  let statusMock;
  let res;

  beforeEach(() => {
    mockPersistenceGateway.deleteKeyCount = deleteKeyCountMock;
    mockPersistenceGateway.getLimiterByKey = getLimiterByKeyMock;
    mockPersistenceGateway.incrementKeyCount = incrementKeyCountMock;
    mockPersistenceGateway.setExpiresAt = jest.fn();

    statusMock = jest.fn(() => ({
      json: () => jest.fn(),
    }));
    res = {
      set: jest.fn(() => ({
        status: statusMock,
      })),
      status: statusMock,
    };
  });

  it('should return a 429 response', async () => {
    const next = jest.fn();
    incrementKeyCountMock.mockReturnValue({
      expiresAt: Date.now() + 1e6,
      id: 20,
    });
    await advancedQueryLimiter('advanced-document-search')(
      {
        applicationContext: applicationContextMock,
      },
      res,
      next,
    );
    expect(statusMock).toBeCalledWith(429);
    expect(next).not.toBeCalled();
  });

  it('should call next if limit is not reached', async () => {
    const next = jest.fn();
    incrementKeyCountMock.mockReturnValue({
      expiresAt: Date.now() + 1e6,
      id: 0,
    });
    await advancedQueryLimiter('advanced-document-search')(
      {
        applicationContext: applicationContextMock,
      },
      res,
      next,
    );
    expect(next).toBeCalled();
  });

  it('should reset the limiter counter if the current time is greater than expiresAt', async () => {
    const next = jest.fn();
    incrementKeyCountMock.mockReturnValue({
      expiresAt: Date.now() - 1e6,
      id: 30,
    });
    await advancedQueryLimiter('advanced-document-search')(
      {
        applicationContext: applicationContextMock,
      },
      res,
      next,
    );
    expect(deleteKeyCountMock).toBeCalled();
    expect(next).toBeCalled();
  });

  it('should be able to be invoked exactly 5 times before reaching next if limit is not reached', async () => {
    const next = jest.fn();
    let count = 0;
    incrementKeyCountMock.mockImplementation(() => {
      return {
        expiresAt: Date.now() + 1e6,
        id: ++count,
      };
    });

    for (let i = 0; i < 5; i++) {
      await advancedQueryLimiter('advanced-document-search')(
        {
          applicationContext: applicationContextMock,
        },
        res,
        next,
      );
    }

    await advancedQueryLimiter('advanced-document-search')(
      {
        applicationContext: applicationContextMock,
      },
      res,
      next,
    );

    expect(next).toBeCalledTimes(5);
    // the 6th call should have failed and not invoked next
    expect(next.mock.calls[5]).toBeUndefined();
    expect(statusMock.mock.calls[0]).toBeDefined();
  });
});

const { userIdLimiter } = require('./userIdLimiter');

let mockPersistenceGateway = {};

jest.mock('../applicationContext', () => () => ({
  getPersistenceGateway: () => mockPersistenceGateway,
}));

describe('userIdLimiter', () => {
  let incrementKeyCountMock = jest.fn();
  const deleteKeyCountMock = jest.fn();
  let statusMock;
  let res;

  beforeEach(() => {
    mockPersistenceGateway.deleteKeyCount = deleteKeyCountMock;
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

  it('should return a 401 response if authorization header not provided', async () => {
    const next = jest.fn();
    incrementKeyCountMock.mockReturnValue({
      expiresAt: Date.now() + 1e6,
      id: 20,
    });
    await userIdLimiter('order-search')(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
        applicationContext: {
          getPersistenceGateway: () => ({
            deleteKeyCount: jest.fn(),
            incrementKeyCount: incrementKeyCountMock,
            setExpiresAt: jest.fn(),
          }),
        },
      },
      res,
      next,
    );
    expect(statusMock).toBeCalledWith(401);
    expect(next).not.toBeCalled();
  });

  it('should return a 429 response', async () => {
    const next = jest.fn();
    incrementKeyCountMock.mockReturnValue({
      expiresAt: Date.now() + 1e6,
      id: 20,
    });
    await userIdLimiter('order-search')(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
        applicationContext: {
          getPersistenceGateway: () => ({
            deleteKeyCount: jest.fn(),
            incrementKeyCount: incrementKeyCountMock,
            setExpiresAt: jest.fn(),
          }),
        },
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlzc2lvbnNjbGVya0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IEFkbWlzc2lvbnMgQ2xlcmsiLCJyb2xlIjoiYWRtaXNzaW9uc2NsZXJrIiwic2VjdGlvbiI6ImFkbWlzc2lvbnMiLCJ1c2VySWQiOiI5ZDdkNjNiNy1kN2E1LTQ5MDUtYmE4OS1lZjcxYmYzMDA1N2YiLCJjdXN0b206cm9sZSI6ImFkbWlzc2lvbnNjbGVyayIsInN1YiI6IjlkN2Q2M2I3LWQ3YTUtNDkwNS1iYTg5LWVmNzFiZjMwMDU3ZiIsImlhdCI6MTYwOTQ0NTUyNn0.kow3pAUloDseD3isrxgtKBpcKsjMktbRBzY41c1NRqA',
        },
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
    await userIdLimiter('order-search')(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
        applicationContext: {
          getPersistenceGateway: () => ({
            deleteKeyCount: jest.fn(),
            incrementKeyCount: incrementKeyCountMock,
            setExpiresAt: jest.fn(),
          }),
        },
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlzc2lvbnNjbGVya0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IEFkbWlzc2lvbnMgQ2xlcmsiLCJyb2xlIjoiYWRtaXNzaW9uc2NsZXJrIiwic2VjdGlvbiI6ImFkbWlzc2lvbnMiLCJ1c2VySWQiOiI5ZDdkNjNiNy1kN2E1LTQ5MDUtYmE4OS1lZjcxYmYzMDA1N2YiLCJjdXN0b206cm9sZSI6ImFkbWlzc2lvbnNjbGVyayIsInN1YiI6IjlkN2Q2M2I3LWQ3YTUtNDkwNS1iYTg5LWVmNzFiZjMwMDU3ZiIsImlhdCI6MTYwOTQ0NTUyNn0.kow3pAUloDseD3isrxgtKBpcKsjMktbRBzY41c1NRqA',
        },
      },
      res,
      next,
    );
    expect(next).toBeCalled();
  });

  it('should delete the limiter key if expires at is passed', async () => {
    const next = jest.fn();
    incrementKeyCountMock.mockReturnValue({
      expiresAt: Date.now() - 1e6,
      id: 30,
    });
    await userIdLimiter('order-search')(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
        applicationContext: {
          getPersistenceGateway: () => ({
            deleteKeyCount: deleteKeyCountMock,
            incrementKeyCount: incrementKeyCountMock,
            setExpiresAt: jest.fn(),
          }),
        },
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlzc2lvbnNjbGVya0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IEFkbWlzc2lvbnMgQ2xlcmsiLCJyb2xlIjoiYWRtaXNzaW9uc2NsZXJrIiwic2VjdGlvbiI6ImFkbWlzc2lvbnMiLCJ1c2VySWQiOiI5ZDdkNjNiNy1kN2E1LTQ5MDUtYmE4OS1lZjcxYmYzMDA1N2YiLCJjdXN0b206cm9sZSI6ImFkbWlzc2lvbnNjbGVyayIsInN1YiI6IjlkN2Q2M2I3LWQ3YTUtNDkwNS1iYTg5LWVmNzFiZjMwMDU3ZiIsImlhdCI6MTYwOTQ0NTUyNn0.kow3pAUloDseD3isrxgtKBpcKsjMktbRBzY41c1NRqA',
        },
      },
      res,
      next,
    );
    expect(deleteKeyCountMock).toBeCalled();
    expect(next).toBeCalled();
  });

  it('should be able to be invoked exactly 15 times before locking next if limit is not reached', async () => {
    const next = jest.fn();
    let count = 0;
    incrementKeyCountMock.mockImplementation(() => {
      return {
        expiresAt: Date.now() + 1e6,
        id: ++count,
      };
    });

    for (let i = 0; i < 15; i++) {
      await userIdLimiter('order-search')(
        {
          apiGateway: {
            event: {
              requestContext: {
                identity: '127.0.0.1',
              },
            },
          },
          applicationContext: {
            getPersistenceGateway: () => ({
              deleteKeyCount: jest.fn(),
              incrementKeyCount: incrementKeyCountMock,
              setExpiresAt: jest.fn(),
            }),
          },
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlzc2lvbnNjbGVya0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IEFkbWlzc2lvbnMgQ2xlcmsiLCJyb2xlIjoiYWRtaXNzaW9uc2NsZXJrIiwic2VjdGlvbiI6ImFkbWlzc2lvbnMiLCJ1c2VySWQiOiI5ZDdkNjNiNy1kN2E1LTQ5MDUtYmE4OS1lZjcxYmYzMDA1N2YiLCJjdXN0b206cm9sZSI6ImFkbWlzc2lvbnNjbGVyayIsInN1YiI6IjlkN2Q2M2I3LWQ3YTUtNDkwNS1iYTg5LWVmNzFiZjMwMDU3ZiIsImlhdCI6MTYwOTQ0NTUyNn0.kow3pAUloDseD3isrxgtKBpcKsjMktbRBzY41c1NRqA',
          },
        },
        res,
        next,
      );
    }

    await userIdLimiter('order-search')(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
        applicationContext: {
          getPersistenceGateway: () => ({
            deleteKeyCount: jest.fn(),
            incrementKeyCount: incrementKeyCountMock,
            setExpiresAt: jest.fn(),
          }),
        },
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWlzc2lvbnNjbGVya0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IEFkbWlzc2lvbnMgQ2xlcmsiLCJyb2xlIjoiYWRtaXNzaW9uc2NsZXJrIiwic2VjdGlvbiI6ImFkbWlzc2lvbnMiLCJ1c2VySWQiOiI5ZDdkNjNiNy1kN2E1LTQ5MDUtYmE4OS1lZjcxYmYzMDA1N2YiLCJjdXN0b206cm9sZSI6ImFkbWlzc2lvbnNjbGVyayIsInN1YiI6IjlkN2Q2M2I3LWQ3YTUtNDkwNS1iYTg5LWVmNzFiZjMwMDU3ZiIsImlhdCI6MTYwOTQ0NTUyNn0.kow3pAUloDseD3isrxgtKBpcKsjMktbRBzY41c1NRqA',
        },
      },
      res,
      next,
    );

    expect(next).toBeCalledTimes(15);
    // the 16th call should have failed and not invoked next
    expect(next.mock.calls[15]).toBeUndefined();
    expect(statusMock.mock.calls[0]).toBeDefined();
  });
});

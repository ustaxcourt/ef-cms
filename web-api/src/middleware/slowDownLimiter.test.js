const { slowDownLimiter } = require('./slowDownLimiter');

let mockPersistenceGateway = {};

jest.mock('../applicationContext', () => () => ({
  getPersistenceGateway: () => mockPersistenceGateway,
}));

describe('slowDownLimiter', () => {
  let incrementKeyCountMock = jest.fn();
  const deleteKeyCountMock = jest.fn();
  let statusMock;
  let res;

  beforeEach(() => {
    mockPersistenceGateway.deleteKeyCount = deleteKeyCountMock;
    mockPersistenceGateway.incrementKeyCount = incrementKeyCountMock;
    mockPersistenceGateway.setExpiresAt = jest.fn();
    global.setTimeout = jest.fn().mockImplementation(next => next());

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

  it('should not call setTimeout on the next call if limit is reached', async () => {
    const next = jest.fn();
    incrementKeyCountMock.mockReturnValue({
      expiresAt: Date.now() + 1e6,
      id: 1,
    });
    await slowDownLimiter('document-search-limiter')(
      {
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
    expect(next).toBeCalled();
  });

  it('should call setTimeout with a delay more than 1 if limit is reached', async () => {
    const next = jest.fn();
    incrementKeyCountMock.mockReturnValue({
      expiresAt: Date.now() + 1e6,
      id: 100,
    });
    await slowDownLimiter('document-search-limiter')(
      {
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
    expect(next).toBeCalled();
    expect(setTimeout).toBeCalledWith(next, 19000);
  });

  it('should delete the limiter key if expires at is passed', async () => {
    const next = jest.fn();
    incrementKeyCountMock.mockReturnValue({
      expiresAt: Date.now() - 1e6,
      id: 30,
    });
    await slowDownLimiter('order-search')(
      {
        applicationContext: {
          getPersistenceGateway: () => ({
            deleteKeyCount: deleteKeyCountMock,
            incrementKeyCount: incrementKeyCountMock,
            setExpiresAt: jest.fn(),
          }),
        },
      },
      res,
      next,
    );
    expect(deleteKeyCountMock).toBeCalled();
    expect(next).toBeCalled();
  });
});

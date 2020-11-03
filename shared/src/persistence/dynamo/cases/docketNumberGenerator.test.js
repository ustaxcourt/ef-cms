jest.mock('../../dynamodbClientService');
const client = require('../../dynamodbClientService');

const DateHandler = require('../../../business/utilities/DateHandler');
const { createDocketNumber } = require('./docketNumberGenerator');

let applicationContext;
describe('Create docket number', function () {
  beforeEach(() => {
    applicationContext = {
      environment: {
        stage: 'local',
      },
      getPersistenceGateway: () => {
        return {
          incrementCounter: () => Promise.resolve(123),
        };
      },
      getUtilities: () => {
        return { ...DateHandler, formatNow: () => '96' };
      },
      logger: { error: () => true, info: () => true },
      notifyHoneybadger: () => true,
    };
  });

  it('should create a docketNumber', async () => {
    const result = await createDocketNumber({
      applicationContext,
      receivedAt: '2045-08-21T20:07:44.018Z',
    });
    expect(result).toEqual('223-45');
  });

  it('should throw an exception if attempting to create a case with an existing docket number', async () => {
    client.get.mockImplementationOnce(() =>
      Promise.resolve({ docketNumber: '223-45' }),
    );

    await expect(
      createDocketNumber({
        applicationContext,
        receivedAt: '2045-08-21T20:07:44.018Z',
      }),
    ).rejects.toThrow('docket number already exists');
  });

  it('should increment the counter for the receivedAt year provided', async () => {
    const incrementCounterMock = jest.fn();

    await createDocketNumber({
      applicationContext: {
        environment: {
          stage: 'local',
        },
        getPersistenceGateway: () => {
          return {
            incrementCounter: incrementCounterMock,
          };
        },
        getUtilities: () => {
          return { ...DateHandler, formatNow: () => '96' };
        },
      },
      receivedAt: '2032-08-21T20:07:44.018Z',
    });

    expect(incrementCounterMock.mock.calls[0][0].year).toEqual('2032');
  });
});

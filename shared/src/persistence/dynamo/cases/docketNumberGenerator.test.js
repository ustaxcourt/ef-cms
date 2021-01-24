jest.mock('../../dynamodbClientService');
const client = require('../../dynamodbClientService');

const DateHandler = require('../../../business/utilities/DateHandler');
const {
  checkCaseExists,
  createDocketNumber,
  getNextDocketNumber,
  MAX_ATTEMPTS,
} = require('./docketNumberGenerator');

let applicationContext;
const startingCounter = 123;

describe('Create docket number', function () {
  beforeEach(() => {
    applicationContext = {
      environment: {
        stage: 'local',
      },
      getPersistenceGateway: () => {
        return {
          incrementCounter: jest
            .fn()
            .mockImplementation(() => Promise.resolve(startingCounter)),
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

  it('should throw an exception if attempting to create a case with an existing docket number after the MAX_ATTEMPTS limit is reached', async () => {
    client.get.mockImplementation(() =>
      Promise.resolve({ docketNumber: '223-45' }),
    );

    await expect(
      createDocketNumber({
        applicationContext,
        receivedAt: '2045-08-21T20:07:44.018Z',
      }),
    ).rejects.toThrow('docket number already exists');

    expect(client.get).toHaveBeenCalledTimes(MAX_ATTEMPTS);
  });

  it('should return an available docketNumber within the specified MAX_ATTEMPTS', async () => {
    client.get = jest.fn().mockImplementation(({ Key }) => {
      let caseMeta;
      const docketNumber = Key.pk.replace('case|', '');

      if (docketNumber === '223-45') {
        caseMeta = { docketNumber: '223-45' }; // returning an existing docket number
      }

      return Promise.resolve(caseMeta);
    });

    let currentCounter;

    applicationContext.getPersistenceGateway = () => ({
      incrementCounter: jest.fn().mockImplementationOnce(() => {
        if (!currentCounter) {
          currentCounter = startingCounter;
        } else {
          currentCounter += 1;
        }

        return Promise.resolve(currentCounter);
      }),
    });

    const result = await createDocketNumber({
      applicationContext,
      receivedAt: '2045-08-21T20:07:44.018Z',
    });

    expect(client.get).toHaveBeenCalledTimes(2); // first attempt returned an existing case, second attempt did not
    expect(result).toEqual('224-45');
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

  describe('checkCaseExists', () => {
    it('returns true if a case with the given docketNumber exists', async () => {
      client.get.mockImplementationOnce(() =>
        Promise.resolve({ docketNumber: '223-45' }),
      );

      const result = await checkCaseExists({
        applicationContext: {},
        docketNumber: '223-45',
      });

      expect(result).toEqual(true);
    });

    it('returns false if a case with the given docketNumber does not exist', async () => {
      client.get.mockImplementationOnce(() => Promise.resolve(undefined));

      const result = await checkCaseExists({
        applicationContext: {},
        docketNumber: '223-45',
      });

      expect(result).toEqual(false);
    });
  });

  describe('getNextDocketNumber', () => {
    it('returns the next docketNumber in the series from persistence', async () => {
      const incrementCounterMock = jest.fn().mockReturnValue(1);

      const result = await getNextDocketNumber({
        applicationContext: {
          environment: {
            stage: 'local',
          },
          getPersistenceGateway: () => {
            return {
              incrementCounter: incrementCounterMock,
            };
          },
        },
        year: '2020',
      });

      expect(result).toEqual('101-20');
    });
  });
});

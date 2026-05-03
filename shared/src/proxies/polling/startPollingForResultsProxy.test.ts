jest.mock('../requests');
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { get } from '../requests';
import { startPollingForResultsInteractor } from '@shared/proxies/polling/startPollingForResultsProxy';

describe('startPollingForResultsProxy', () => {
  let GET_RESPONSES: any[] = [];
  let iteration = 0;
  const TEST_REQUEST_ID = 'TEST_REQUEST_ID';
  const nowSeconds = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  const oneHourInSeconds = 60 * 60;
  const TEST_EXP_DATE = nowSeconds + oneHourInSeconds;
  let RESOLVER_MOCK;

  beforeEach(() => {
    RESOLVER_MOCK = jest.fn();
    GET_RESPONSES = [];
    iteration = 0;
    (get as jest.Mock).mockImplementation(() => {
      const results = GET_RESPONSES[iteration];
      iteration += 1;
      return new Promise(resolve => resolve(results));
    });
    applicationContext.getUtilities().sleep = jest
      .fn()
      .mockImplementation(() => {});
  });

  it('should resolve the request when it gets the status code 200 response in the first try', async () => {
    const responseObj = {
      statusCode: 200,
    };

    GET_RESPONSES = [
      {
        response: JSON.stringify(responseObj),
      },
    ];
    await startPollingForResultsInteractor(
      applicationContext,
      TEST_REQUEST_ID,
      TEST_EXP_DATE,
      RESOLVER_MOCK,
    );

    expect(RESOLVER_MOCK).toHaveBeenCalledWith(responseObj);
    expect(get).toHaveBeenCalledTimes(1);
  });

  it('should resolve the request when it gets the status code 200 response in the third try', async () => {
    const responseObj = {
      statusCode: 200,
    };

    GET_RESPONSES = [
      undefined,
      undefined,
      {
        response: JSON.stringify(responseObj),
      },
    ];
    await startPollingForResultsInteractor(
      applicationContext,
      TEST_REQUEST_ID,
      TEST_EXP_DATE,
      RESOLVER_MOCK,
    );

    expect(RESOLVER_MOCK).toHaveBeenCalledWith(responseObj);
    expect(get).toHaveBeenCalledTimes(3);
  });

  it('should resolve the request when it gets the status code 503 in the second iteration', async () => {
    GET_RESPONSES = [
      undefined,
      {
        response: JSON.stringify({
          statusCode: 503,
        }),
      },
      {
        response: JSON.stringify({
          statusCode: 200,
        }),
      },
    ];
    await startPollingForResultsInteractor(
      applicationContext,
      TEST_REQUEST_ID,
      TEST_EXP_DATE,
      RESOLVER_MOCK,
    );

    expect(RESOLVER_MOCK).toHaveBeenCalledWith({
      statusCode: 503,
    });
    expect(get).toHaveBeenCalledTimes(2);
  });

  it('should resolve the request with 504 status code when expiration time has passed', async () => {
    const responseObj = {
      statusCode: 504,
    };

    await startPollingForResultsInteractor(
      applicationContext,
      TEST_REQUEST_ID,
      0,
      RESOLVER_MOCK,
    );

    expect(RESOLVER_MOCK).toHaveBeenCalledWith(responseObj);
    expect(get).toHaveBeenCalledTimes(1);
  });
});

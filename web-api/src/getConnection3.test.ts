import { mockEntireFile } from '@shared/test/mockFactory';
jest.mock('@shared/business/utilities/DateHandler', () =>
  mockEntireFile({
    keepImplementation: true,
    module: '@shared/business/utilities/DateHandler',
  }),
);
const mockGetAuthToken = jest.fn();
jest.mock('@aws-sdk/rds-signer', () => {
  class Signer {
    getAuthToken() {
      return mockGetAuthToken();
    }
  }
  return {
    Signer,
  };
});
jest.mock('pg', () => {
  class Pool {
    options = {};
    connect() {
      return { release() {} };
    }
  }
  return {
    Pool,
  };
});
import { getConnection } from '@web-api/getConnection';
import { environment } from '@web-api/environment';
import { sleep } from '@shared/tools/helpers';
import { formatNow as formatNowMock } from '@shared/business/utilities/DateHandler';

describe('getConnection', () => {
  environment.stage = 'testing';
  it('should wait for pool password when multiple promises are attempting to reset', async () => {
    // first two calls to formatNow correspond to the FIRST getConnection call (formatNow is called twice)
    // thereafter, our token should be expired (set to 15 minutes later which is greater than the 13 minute timer in getConnection)
    mockGetAuthToken.mockResolvedValue('12346789');
    const formatNow = jest.mocked(formatNowMock);
    formatNow
      .mockReturnValueOnce('1747161078724')
      .mockReturnValueOnce('1747161078724')
      .mockReturnValue(`${1747161078724 + 1000 * 60 * 15}`);
    await getConnection({ cb: () => {} });
    let hasResetPassword = false;

    // We want all calls to getConnection to wait until after the call to getToken has resolved. hasResetPassword is a proxy for this.
    mockGetAuthToken.mockImplementation(async () => {
      await sleep(20);
      hasResetPassword = true;
      return Promise.resolve('123456789');
    });

    const result = await Promise.all([
      getConnection({
        cb: () => {
          return hasResetPassword;
        },
      }),
      getConnection({
        cb: () => {
          return hasResetPassword;
        },
      }),
      getConnection({
        cb: () => {
          return hasResetPassword;
        },
      }),
    ]);

    // ensures that password has been reset before simultaneous connections execute callbacks (only one token reset)
    expect(result).toEqual([true, true, true]);
    expect(mockGetAuthToken).toHaveBeenCalledTimes(2);
  });
});

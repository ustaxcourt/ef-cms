import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const startPollingForResultsInteractor = async (
  applicationContext: ClientApplicationContext,
  requestId: string,
  expirationTimestamp: number,
  resolver: (result: { statusCode: number; [key: string]: unknown }) => void,
  attemptNumber = 1,
) => {
  const WAIT_TIME = attemptNumber < 10 ? 1500 : 5000;
  await applicationContext.getUtilities().sleep(WAIT_TIME);
  return await get({
    applicationContext,
    endpoint: `/results/fetch/${requestId}`,
  }).then(async (results: { response: any }) => {
    const nowSeconds = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
    if (expirationTimestamp < nowSeconds) {
      return resolver({ statusCode: 504 });
    }

    if (!results) {
      return await startPollingForResultsInteractor(
        applicationContext,
        requestId,
        expirationTimestamp,
        resolver,
        attemptNumber + 1,
      );
    }

    const { response } = results;
    const responseObj = JSON.parse(response);
    if (resolver) resolver(responseObj);
  });
};

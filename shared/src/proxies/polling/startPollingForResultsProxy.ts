import { get } from '../requests';

export const startPollingForResultsInteractor = async (
  applicationContext,
  requestId: string,
  expirationTimestamp: number,
) => {
  await applicationContext.getUtilities().sleep(1500);
  return await get({
    applicationContext,
    endpoint: `/results/fetch/${requestId}`,
  }).then(async (results: { response: any }) => {
    const resolver = applicationContext
      .getAsynSyncUtil()
      .getAsyncSyncCompleter(requestId);

    const nowUnixTimeInSeconds = Math.floor(Date.now() / 1000);
    if (expirationTimestamp < nowUnixTimeInSeconds) {
      return resolver({ statusCode: 504 });
    }

    if (!results) {
      return await startPollingForResultsInteractor(
        applicationContext,
        requestId,
        expirationTimestamp,
      );
    }

    const { response } = results;
    const responseObj = JSON.parse(response);
    if (+responseObj.statusCode === 503)
      return await startPollingForResultsInteractor(
        applicationContext,
        requestId,
        expirationTimestamp,
      );

    if (resolver) resolver(responseObj);
    applicationContext.getAsynSyncUtil().removeAsyncSyncCompleter(requestId);
  });
};

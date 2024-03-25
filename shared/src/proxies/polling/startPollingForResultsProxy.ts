import { get } from '../requests';

export const startPollingForResultsInteractor = async (
  applicationContext,
  requestId: string,
) => {
  await applicationContext.getUtilities().sleep(1500);
  return await get({
    applicationContext,
    endpoint: `/results/fetch/${requestId}`,
  }).then(async (results: { response: any }) => {
    if (!results)
      return await startPollingForResultsInteractor(
        applicationContext,
        requestId,
      );

    const { response } = results;
    const responseObj = JSON.parse(response);
    if (+responseObj.statusCode === 503)
      return await startPollingForResultsInteractor(
        applicationContext,
        requestId,
      );

    const resolver = applicationContext
      .getAsynSyncUtil()
      .getAsyncSyncCompleter(requestId);

    if (resolver) resolver(responseObj);
    applicationContext.getAsynSyncUtil().removeAsyncSyncCompleter(requestId);
  });
};

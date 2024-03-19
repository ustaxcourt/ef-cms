export const setAsyncSyncResultAction = ({
  applicationContext,
  props,
}: ActionProps) => {
  const { asyncSyncId, response } = props;
  if (response.statusCode === 503) return;

  const callback = applicationContext
    .getAsynSyncUtil()
    .getAsyncSyncResult(asyncSyncId);

  if (callback) callback(response);
};
